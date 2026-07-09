"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, onSnapshot, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState("home"); // home | pending | approved
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: null, reg: null });
  const [detailLoading, setDetailLoading] = useState(false);
  const router = useRouter();

  // Verificar Auth y Admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", currentUser.email));
          if (adminDoc.exists() && adminDoc.data().active === true) {
            setUser(currentUser);
            setIsAdmin(true);
          } else {
            await auth.signOut();
            router.push("/admin/login");
          }
        } catch (err) {
          console.error("Error validando admin:", err);
          router.push("/admin/login");
        }
      } else {
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Escuchar registros en tiempo real
  useEffect(() => {
    if (!isAdmin) return;
    
    const q = query(collection(db, "participantes"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const grouped = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const hash = data.comprobanteHash || docSnap.id;
        
        if (!grouped[hash]) {
          grouped[hash] = { 
            ...data, 
            id: hash, 
            docIds: [docSnap.id], 
            ticket_numeros_list: [data.ticket_numero],
            count: 1 
          };
        } else {
          grouped[hash].docIds.push(docSnap.id);
          grouped[hash].ticket_numeros_list.push(data.ticket_numero);
          grouped[hash].count++;
        }
      });
      
      setRegistrations(Object.values(grouped).sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-solid-yellow flex items-center justify-center">
        <div className="font-heavy text-3xl animate-pulse">CARGANDO DASHBOARD...</div>
      </div>
    );
  }

  const pendingRegs = registrations.filter(r => r.status === "pending" || !r.status);
  const approvedRegs = registrations.filter(r => r.status === "approved");
  const rejectedRegs = registrations.filter(r => r.status === "rejected");

  const handleApproveClick = (reg) => {
    setModalState({ isOpen: true, type: "approve", reg });
  };

  const handleRejectClick = (reg) => {
    setModalState({ isOpen: true, type: "reject", reg });
  };

  const handleRestoreClick = (reg) => {
    setModalState({ isOpen: true, type: "restore", reg });
  };

  const handleHardDeleteClick = (reg) => {
    setModalState({ isOpen: true, type: "delete", reg });
  };

  const handleEmptyTrashClick = () => {
    setModalState({ isOpen: true, type: "empty_trash", reg: null });
  };

  const confirmAction = async () => {
    const { type, reg } = modalState;
    setProcessing(true);
    try {
      if (type === "approve" && reg) {
        const promises = reg.docIds.map(docId => 
          updateDoc(doc(db, "participantes", docId), {
            status: "approved",
            approvedAt: serverTimestamp(),
            approvedBy: user.email
          })
        );
        await Promise.all(promises);
      } else if (type === "reject" && reg) {
        const promises = reg.docIds.map(docId => 
          updateDoc(doc(db, "participantes", docId), {
            status: "rejected",
            rejectedAt: serverTimestamp(),
            rejectedBy: user.email
          })
        );
        await Promise.all(promises);
      } else if (type === "restore" && reg) {
        const promises = reg.docIds.map(docId => 
          updateDoc(doc(db, "participantes", docId), {
            status: "approved", // Se cambia de pending a approved para que queden aprobados al restaurar
            restoredAt: serverTimestamp(),
            restoredBy: user.email,
            approvedAt: serverTimestamp(),
            approvedBy: user.email
          })
        );
        await Promise.all(promises);
      } else if (type === "delete" && reg) {
        const promises = reg.docIds.map(docId => deleteDoc(doc(db, "participantes", docId)));
        await Promise.all(promises);
      } else if (type === "empty_trash") {
        const promises = [];
        rejectedRegs.forEach(r => {
          r.docIds.forEach(docId => {
            promises.push(deleteDoc(doc(db, "participantes", docId)));
          });
        });
        await Promise.all(promises);
      }
      setSelectedReg(null);
      setModalState({ isOpen: false, type: null, reg: null });
    } catch (err) {
      console.error("Error procesando:", err);
      alert("Error al procesar la solicitud.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSelectReg = (reg) => {
    if (selectedReg?.id === reg.id) return;
    setDetailLoading(true);
    setSelectedReg(reg);
    setTimeout(() => setDetailLoading(false), 400);
  };

  const downloadExcel = () => {
    const dataToExport = [];
    
    // Convertir a 1 fila por ticket
    approvedRegs.forEach(reg => {
      reg.ticket_numeros_list.forEach(ticket_codigo => {
        dataToExport.push({
          NOMBRES: reg.nombres,
          APELLIDOS: reg.apellidos,
          DNI: reg.dni,
          WHATSAPP: reg.whatsapp,
          DEPARTAMENTO: reg.departamento,
          TICKET_CODIGO: ticket_codigo, // Fila individual por ticket
          MONTO_TICKET: 10, // Costo unitario
          SORTEO: reg.sorteo,
          APROBADO_POR: reg.approvedBy
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets_Aprobados");
    XLSX.writeFile(wb, "Sorteo_Tickets_Individuales.xlsx");
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] font-sans text-gray-800 flex flex-col md:flex-row overflow-x-hidden relative">
      
      {/* HEADER MÓVIL (Solo visible en md:hidden) */}
      <div className="md:hidden bg-white border-b-[3px] border-solid-black p-4 flex items-center justify-between z-30 shrink-0 w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-solid-black brutal-shadow-sm overflow-hidden bg-white">
            <img src="/logo_premios_Romero.webp" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-heavy text-lg uppercase tracking-wide text-solid-black">Panel Admin</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Campana de Notificaciones */}
          <button 
            onClick={() => { setActiveTab("pending"); setSelectedReg(null); }}
            className="w-10 h-10 bg-white border-[3px] border-solid-black text-solid-black rounded-full flex items-center justify-center brutal-shadow-sm relative transition-all"
          >
            <i className="fa-regular fa-bell text-xl"></i>
            {pendingRegs.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-heavy w-5 h-5 flex items-center justify-center rounded-full border-[2px] border-solid-black shadow-sm">
                {pendingRegs.length > 9 ? '+9' : pendingRegs.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 bg-solid-yellow text-solid-black border-[3px] border-solid-black brutal-shadow-sm flex items-center justify-center hover:-translate-y-1 hover:brutal-shadow transition-all"
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      {/* OVERLAY MÓVIL */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR LATERAL (Drawer en móvil) */}
      <aside className={`fixed md:static inset-y-0 left-0 w-[280px] md:w-64 bg-white border-r-[3px] border-solid-black flex flex-col shadow-2xl md:shadow-none shrink-0 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        
        {/* Botón cerrar en móvil */}
        <button 
          onClick={() => setIsSidebarOpen(false)} 
          className="md:hidden absolute top-5 right-4 w-8 h-8 flex items-center justify-center border-[3px] border-solid-black bg-white text-solid-black brutal-shadow-sm hover:bg-red-400 transition-colors"
        >
           <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="p-6 border-b-[3px] border-solid-black flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-solid-black brutal-shadow-sm overflow-hidden bg-white shrink-0">
            <img src="/logo_premios_Romero.webp" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-heavy text-lg uppercase tracking-wide text-solid-black">Premios Romero</span>
        </div>
        
        <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
          <p className="text-xs font-heavy text-gray-400 uppercase tracking-wider mb-2 px-2">Menú Principal</p>
          
          <button 
            onClick={() => { setActiveTab("home"); setSelectedReg(null); setIsSidebarOpen(false); }}
            className={`w-full text-left px-4 py-3 border-[3px] border-solid-black flex items-center gap-3 font-heavy uppercase transition-all ${activeTab === "home" ? "bg-solid-yellow text-solid-black brutal-shadow" : "bg-white text-solid-black brutal-shadow-sm hover:-translate-y-1 hover:brutal-shadow"}`}
          >
            <i className="fa-solid fa-house w-4 text-center"></i> Inicio
          </button>

          <button 
            onClick={() => { setActiveTab("pending"); setSelectedReg(null); setIsSidebarOpen(false); }}
            className={`w-full text-left px-4 py-3 border-[3px] border-solid-black flex justify-between items-center font-heavy uppercase transition-all ${activeTab === "pending" ? "bg-solid-yellow text-solid-black brutal-shadow" : "bg-white text-solid-black brutal-shadow-sm hover:-translate-y-1 hover:brutal-shadow"}`}
          >
            <span className="flex items-center gap-3"><i className="fa-solid fa-clock-rotate-left w-4 text-center"></i> Pendientes</span>
            {pendingRegs.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 border-2 border-solid-black brutal-shadow-sm">{pendingRegs.length}</span>
            )}
          </button>

          <button 
            onClick={() => { setActiveTab("approved"); setSelectedReg(null); setIsSidebarOpen(false); }}
            className={`w-full text-left px-4 py-3 border-[3px] border-solid-black flex justify-between items-center font-heavy uppercase transition-all mb-3 ${activeTab === "approved" ? "bg-solid-green text-white brutal-shadow" : "bg-white text-solid-black brutal-shadow-sm hover:-translate-y-1 hover:brutal-shadow"}`}
          >
            <span className="flex items-center gap-3"><i className="fa-solid fa-circle-check w-4 text-center"></i> Aprobados</span>
          </button>
          
          <p className="text-xs font-heavy text-gray-400 uppercase tracking-wider mb-2 px-2 mt-4 border-t-2 border-dashed border-gray-200 pt-4">Papelera</p>
          
          <button 
            onClick={() => { setActiveTab("rejected"); setSelectedReg(null); setIsSidebarOpen(false); }}
            className={`w-full text-left px-4 py-3 border-[3px] border-solid-black flex justify-between items-center font-heavy uppercase transition-all ${activeTab === "rejected" ? "bg-red-500 text-white brutal-shadow" : "bg-white text-solid-black brutal-shadow-sm hover:-translate-y-1 hover:brutal-shadow hover:text-red-500"}`}
          >
            <span className="flex items-center gap-3"><i className="fa-solid fa-trash w-4 text-center"></i> Rechazados</span>
            {rejectedRegs.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 border-2 border-solid-black brutal-shadow-sm">{rejectedRegs.length}</span>
            )}
          </button>
        </div>

        <div className="p-4 border-t-[3px] border-solid-black bg-gray-50 mt-auto">
          <div className="flex items-center gap-3 mb-4 overflow-hidden px-2">
            <div className="w-8 h-8 rounded-full border-[3px] border-solid-black bg-white flex items-center justify-center shrink-0">
              <i className="fa-solid fa-user text-solid-black text-sm"></i>
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-heavy text-gray-500 uppercase">Administrador</p>
              <p className="text-xs font-bold text-solid-black truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="w-full bg-white border-[3px] border-solid-black text-solid-black py-2.5 font-heavy uppercase text-sm flex items-center justify-center gap-2 brutal-shadow-sm hover:-translate-y-1 hover:brutal-shadow hover:bg-red-400 transition-all"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Salir del sistema
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        
        {/* Header Superior del Dashboard */}
        <header className="bg-solid-yellow border-b-[3px] border-solid-black px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between shrink-0 z-10">
          <div>
            <h1 className="font-heavy text-2xl uppercase text-solid-black">Panel de Control</h1>
            <p className="text-sm text-solid-black font-heavy opacity-80 uppercase">Gestión de registros y validación de pagos</p>
          </div>
        </header>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          
          {/* Tarjetas de Estadísticas (Solo visibles en Inicio) */}
          {activeTab === "home" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
              <div className="bg-white border-[3px] border-solid-black brutal-shadow p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 border-[3px] border-solid-black brutal-shadow-sm bg-white flex items-center justify-center text-solid-black text-2xl shrink-0">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div>
                  <p className="text-xs font-heavy text-gray-500 uppercase tracking-wider">Total Registros</p>
                  <p className="font-heavy text-3xl text-solid-black">{registrations.length}</p>
                </div>
              </div>
              
              <div className="bg-white border-[3px] border-solid-black brutal-shadow p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 border-[3px] border-solid-black brutal-shadow-sm bg-solid-green flex items-center justify-center text-white text-2xl shrink-0">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <div>
                  <p className="text-xs font-heavy text-gray-500 uppercase tracking-wider">Aprobados</p>
                  <p className="font-heavy text-3xl text-solid-black">{approvedRegs.length}</p>
                </div>
              </div>
              
              <div className="bg-white border-[3px] border-solid-black brutal-shadow p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 border-[3px] border-solid-black brutal-shadow-sm bg-red-400 flex items-center justify-center text-white text-2xl shrink-0">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <div>
                  <p className="text-xs font-heavy text-gray-500 uppercase tracking-wider">Pendientes</p>
                  <p className="font-heavy text-3xl text-solid-black">{pendingRegs.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Área de Listado y Detalles */}
          {activeTab !== "home" && (
            <div className="bg-white border-[3px] border-solid-black brutal-shadow flex flex-col lg:flex-row min-h-[600px] overflow-hidden">
            
            {/* Lista */}
            <div className={`w-full lg:w-[400px] flex-col border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-solid-black bg-white shrink-0 ${selectedReg ? "hidden lg:flex" : "flex"}`}>
              
              {/* Header de la lista */}
              <div className="p-4 border-b-[3px] border-solid-black bg-solid-yellow flex flex-col justify-center sticky top-0 z-10 min-h-[60px]">
                <div className="flex items-center justify-between">
                  <h3 className="font-heavy text-sm text-solid-black uppercase tracking-wider">
                    {activeTab === "pending" ? "Requieren Revisión" : activeTab === "approved" ? "Registros Aprobados" : "Registros Rechazados"}
                  </h3>
                  <span className="text-xs font-heavy text-white border border-solid-black brutal-shadow-sm bg-solid-black px-2 py-1">
                    {(activeTab === "pending" ? pendingRegs : activeTab === "approved" ? approvedRegs : rejectedRegs).length}
                  </span>
                </div>
                {activeTab === "rejected" && rejectedRegs.length > 0 && (
                  <button 
                    onClick={handleEmptyTrashClick}
                    className="mt-3 bg-red-500 text-white font-heavy text-[10px] uppercase px-3 py-1.5 border-2 border-solid-black brutal-shadow-sm hover:brutal-shadow transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-fire"></i> Vaciar Rechazados
                  </button>
                )}
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto h-[550px] divide-y divide-gray-100 relative">
                {activeTab === "rejected" && rejectedRegs.length > 0 && (
                  <div className="bg-red-50 border-b-2 border-dashed border-red-200 p-3 text-center">
                    <p className="text-[10px] font-bold text-red-600 uppercase"><i className="fa-solid fa-circle-exclamation mr-1"></i> Se sugiere eliminar los registros rechazados cada 30 a 40 días para no llenar el espacio de almacenamiento.</p>
                  </div>
                )}
                {(activeTab === "pending" ? pendingRegs : activeTab === "approved" ? approvedRegs : rejectedRegs).map((reg) => (
                  <div 
                    key={reg.id} 
                    onClick={() => handleSelectReg(reg)}
                    className={`p-4 cursor-pointer transition-colors border-b-[3px] border-solid-black last:border-b-0 ${selectedReg?.id === reg.id ? "bg-solid-yellow border-l-8 border-l-solid-black brutal-shadow relative z-10" : "hover:bg-gray-50 border-l-8 border-l-transparent"}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-heavy text-base uppercase leading-tight truncate pr-2 text-solid-black">
                        {reg.nombres} {reg.apellidos}
                      </h4>
                      <span className={`font-heavy text-sm shrink-0 ${selectedReg?.id === reg.id ? "text-solid-black" : (activeTab === "rejected" ? "text-red-500" : "text-blue-600")}`}>
                        S/ {reg.monto_total}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-heavy text-solid-black uppercase">
                      <span className={`px-2 py-0.5 border border-solid-black brutal-shadow-sm ${selectedReg?.id === reg.id ? "bg-white" : "bg-gray-100"}`}><i className="fa-regular fa-id-card mr-1"></i> {reg.dni}</span>
                      <span className={`px-2 py-0.5 border border-solid-black brutal-shadow-sm ${selectedReg?.id === reg.id ? "bg-white" : "bg-gray-100"}`}><i className="fa-brands fa-whatsapp text-green-600 mr-1"></i> {reg.whatsapp}</span>
                      <span className={`px-2 py-0.5 border border-solid-black brutal-shadow-sm ${selectedReg?.id === reg.id ? "bg-solid-black text-white" : "bg-white"}`}>{reg.count} TICKETS</span>
                    </div>
                  </div>
                ))}
                
                {(activeTab === "pending" ? pendingRegs : activeTab === "approved" ? approvedRegs : rejectedRegs).length === 0 && (
                  <div className="p-12 text-center flex flex-col items-center justify-center h-[300px]">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                      <i className="fa-solid fa-inbox text-2xl text-gray-300"></i>
                    </div>
                    <p className="text-gray-400 font-bold uppercase text-sm">Bandeja vacía</p>
                  </div>
                )}
              </div>
            </div>

            {/* Panel de Detalles */}
            {selectedReg ? (
              <div className="flex-1 bg-white flex flex-col h-[600px] lg:h-auto overflow-hidden relative">
                
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                  <h3 className="font-heavy text-lg uppercase text-gray-800 truncate">Detalle del Registro</h3>
                  <button onClick={() => setSelectedReg(null)} className="lg:hidden text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full transition-colors">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                  
                  {detailLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <i className="fa-solid fa-spinner fa-spin text-5xl text-solid-black mb-4"></i>
                      <p className="font-heavy text-gray-500 uppercase tracking-widest text-sm animate-pulse">Cargando datos...</p>
                    </div>
                  ) : (
                    <>
                      {/* Tarjeta de Información */}
                      <div className="bg-white brutal-shadow-sm rounded-none p-5 border-[3px] border-solid-black grid grid-cols-2 gap-y-5 gap-x-4">
                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-[10px] font-heavy text-gray-500 uppercase tracking-wider mb-1">Nombre Completo</p>
                          <p className="font-heavy text-base uppercase text-solid-black leading-tight">{selectedReg.nombres} {selectedReg.apellidos}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-heavy text-gray-500 uppercase tracking-wider mb-1">DNI</p>
                          <p className="font-bold text-solid-black">{selectedReg.dni}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-heavy text-gray-500 uppercase tracking-wider mb-1">Monto Depositado</p>
                          <p className="font-heavy text-xl text-solid-green">S/ {selectedReg.monto_total}</p>
                        </div>
                        <div className="col-span-2 mt-2">
                          <p className="text-[10px] font-heavy text-gray-500 uppercase tracking-wider mb-2">Tickets Generados ({selectedReg.count})</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedReg.ticket_numeros_list.map((code, idx) => (
                              <div key={idx} className="bg-white border-2 border-solid-black text-solid-black font-heavy px-3 py-1.5 flex items-center gap-2 brutal-shadow-sm">
                                <i className="fa-solid fa-ticket text-solid-yellow"></i> {code}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Foto Voucher */}
                      <div className="flex-1 flex flex-col min-h-[200px]">
                        <p className="text-[10px] font-heavy text-gray-500 uppercase tracking-wider mb-2">Comprobante de Pago Adjunto</p>
                        <div className="bg-gray-100 border-[3px] border-solid-black flex-1 flex items-center justify-center p-2 relative group overflow-hidden">
                          {(selectedReg.comprobanteUrl || selectedReg.comprobante_url) ? (
                            <>
                              <a href={selectedReg.comprobanteUrl || selectedReg.comprobante_url} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                                <img src={selectedReg.comprobanteUrl || selectedReg.comprobante_url} alt="Voucher" className="max-w-full max-h-[300px] object-contain group-hover:scale-[1.02] transition-transform duration-300" />
                              </a>
                              <div className="absolute bottom-3 right-3 bg-solid-black text-white border-2 border-white px-3 py-1.5 text-xs font-heavy pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity brutal-shadow">
                                <i className="fa-solid fa-magnifying-glass-plus mr-1"></i> Ampliar
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <i className="fa-regular fa-image text-3xl mb-2"></i>
                              <span className="font-bold text-sm">Sin comprobante adjunto</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Acciones */}
                      {selectedReg.status === "pending" || !selectedReg.status ? (
                        <div className="mt-4 grid grid-cols-2 gap-4 shrink-0">
                          <button 
                            onClick={() => handleRejectClick(selectedReg)}
                            className="bg-white hover:bg-red-400 hover:text-white text-solid-black border-[3px] border-solid-black font-heavy text-sm py-3 brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                          >
                            <i className="fa-solid fa-xmark"></i> Rechazar
                          </button>
                          <button 
                            onClick={() => handleApproveClick(selectedReg)}
                            className="bg-solid-green hover:bg-green-500 text-white font-heavy text-sm py-3 border-[3px] border-solid-black brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                          >
                            <i className="fa-solid fa-check"></i> Aprobar Registro
                          </button>
                        </div>
                      ) : selectedReg.status === "approved" ? (
                        <div className="mt-4 shrink-0">
                          <div className="bg-solid-green border-[3px] border-solid-black text-white font-heavy p-4 brutal-shadow-sm text-sm flex items-center justify-center">
                            <i className="fa-solid fa-shield-check text-lg mr-2"></i>
                            Verificado y Aprobado por: {selectedReg.approvedBy}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 flex flex-col gap-3 shrink-0">
                          <div className="bg-red-50 border-[3px] border-solid-black text-red-600 font-heavy p-4 brutal-shadow-sm text-sm flex items-center justify-center">
                            <i className="fa-solid fa-triangle-exclamation text-lg mr-2"></i>
                            Rechazado por: {selectedReg.rejectedBy || "Administrador"}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <button 
                              onClick={() => handleRestoreClick(selectedReg)}
                              className="bg-white text-solid-black font-heavy uppercase border-[3px] border-solid-black py-2 brutal-shadow-sm hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                              <i className="fa-solid fa-rotate-left"></i> Restaurar
                            </button>
                            <button 
                              onClick={() => handleHardDeleteClick(selectedReg)}
                              className="bg-red-500 text-white font-heavy uppercase border-[3px] border-solid-black py-2 brutal-shadow-sm hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                              <i className="fa-solid fa-trash"></i> Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex flex-1 bg-gray-50 items-center justify-center p-8 text-center border-l border-gray-100">
                <div className="max-w-xs">
                  <div className="w-20 h-20 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-file-invoice-dollar text-3xl text-gray-300"></i>
                  </div>
                  <h3 className="font-heavy text-xl text-gray-800 uppercase mb-2">Seleccione un registro</h3>
                  <p className="text-sm font-bold text-gray-400">Elija un registro de la lista para revisar su información y validar el comprobante de pago.</p>
                </div>
              </div>
            )}
            
            </div>
          )}

          {/* ESTADO INICIO (HOME) */}
          {activeTab === "home" && (
            <div className="flex flex-col gap-6">
              {/* Resumen Principal */}
              <div className="bg-solid-green border-[3px] border-solid-black brutal-shadow p-8 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-sm font-heavy text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-wallet"></i> Total Recaudado (Aprobados)
                  </p>
                  <h2 className="text-4xl md:text-5xl font-heavy mb-2 tracking-tight">
                    S/ {approvedRegs.reduce((acc, curr) => acc + (curr.monto_total || 0), 0).toFixed(2)}
                  </h2>
                  <p className="text-white font-bold max-w-md mt-4 opacity-90 text-sm leading-relaxed">
                    Este monto representa la suma total de todos los tickets pagados y verificados en el sistema.
                  </p>
                </div>
                <i className="fa-solid fa-chart-line absolute -right-4 -bottom-8 text-9xl text-white opacity-20 group-hover:scale-110 transition-transform duration-500"></i>
              </div>

              {/* Actividad Reciente */}
              <div className="bg-white border-[3px] border-solid-black brutal-shadow overflow-hidden">
                <div className="p-5 border-b-[3px] border-solid-black flex items-center justify-between bg-solid-yellow">
                  <h3 className="font-heavy text-lg uppercase text-solid-black flex items-center gap-2">
                    <i className="fa-solid fa-bolt text-white bg-solid-black p-1"></i> Actividad Reciente
                  </h3>
                  <span className="text-xs font-heavy text-white bg-solid-black px-2 py-1">Últimos 5</span>
                </div>
                <div className="divide-y-2 divide-solid-black">
                  {registrations.slice(0, 5).map(reg => (
                    <div key={reg.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 border-2 border-solid-black brutal-shadow-sm flex items-center justify-center text-white shrink-0 ${reg.status === 'approved' ? 'bg-solid-green' : 'bg-red-400'}`}>
                          <i className={`fa-solid ${reg.status === 'approved' ? 'fa-check' : 'fa-clock'}`}></i>
                        </div>
                        <div>
                          <p className="font-heavy text-solid-black uppercase tracking-tight">{reg.nombres} {reg.apellidos}</p>
                          <p className="text-xs font-heavy text-gray-500 uppercase mt-0.5">
                            {reg.count} {reg.count === 1 ? 'TICKET' : 'TICKETS'} • S/ {reg.monto_total}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-heavy px-2.5 py-1 uppercase tracking-wider border-2 border-solid-black brutal-shadow-sm ${reg.status === 'approved' ? 'bg-solid-green text-white' : 'bg-red-400 text-white'}`}>
                          {reg.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {registrations.length === 0 && (
                    <div className="p-12 text-center text-gray-400 font-bold flex flex-col items-center">
                      <i className="fa-regular fa-folder-open text-4xl mb-3 text-gray-300"></i>
                      No hay registros recientes.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BOTÓN FLOTANTE DE EXCEL (Solo en Aprobados) */}
          {activeTab === "approved" && approvedRegs.length > 0 && (
            <button 
              onClick={downloadExcel}
              className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-solid-green text-white rounded-full flex items-center justify-center border-4 border-solid-black brutal-shadow hover:-translate-y-2 hover:bg-green-500 transition-all group"
              title="Descargar Excel"
            >
              <i className="fa-solid fa-file-excel text-2xl group-hover:scale-110 transition-transform"></i>
            </button>
          )}

        </div>
      </main>

      {/* MODAL NEO-BRUTALISTA */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !processing && setModalState({ isOpen: false, type: null, reg: null })}></div>
          
          <div className="relative w-full max-w-sm bg-white border-4 border-solid-black brutal-shadow p-6 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            <div className={`w-16 h-16 border-[3px] border-solid-black brutal-shadow-sm flex items-center justify-center mx-auto mb-4 ${modalState.type === 'approve' ? 'bg-solid-green text-white' : modalState.type === 'restore' ? 'bg-solid-yellow text-solid-black' : 'bg-red-500 text-white'}`}>
              <i className={`fa-solid text-3xl ${modalState.type === 'approve' ? 'fa-check' : modalState.type === 'restore' ? 'fa-rotate-left' : modalState.type === 'empty_trash' ? 'fa-fire' : 'fa-triangle-exclamation'}`}></i>
            </div>
            
            <h2 className="font-heavy text-2xl uppercase text-center text-solid-black mb-2">
              {modalState.type === 'approve' ? '¿Aprobar Registro?' : modalState.type === 'reject' ? '¿Rechazar Registro?' : modalState.type === 'restore' ? '¿Restaurar Registro?' : modalState.type === 'empty_trash' ? '¿Vaciar Rechazados?' : '¿Eliminar Definitivo?'}
            </h2>
            
            <p className="text-center font-bold text-gray-600 mb-6 text-sm">
              {modalState.type === 'approve' ? (
                <>¿Estás seguro de validar los <strong>{modalState.reg?.count} tickets</strong> de <strong>{modalState.reg?.nombres}</strong>?</>
              ) : modalState.type === 'reject' ? (
                <>Este registro pasará a la lista de rechazados. ¿Deseas continuar?</>
              ) : modalState.type === 'restore' ? (
                <>El registro de <strong>{modalState.reg?.nombres}</strong> volverá a la bandeja de pendientes para ser revisado nuevamente.</>
              ) : modalState.type === 'empty_trash' ? (
                <>Se eliminarán <strong>TODOS</strong> los registros rechazados permanentemente. Esta acción no se puede deshacer.</>
              ) : (
                <>Esta acción eliminará permanentemente a <strong>{modalState.reg?.nombres}</strong> del sistema. ¿Deseas continuar?</>
              )}
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setModalState({ isOpen: false, type: null, reg: null })}
                disabled={processing}
                className="bg-white text-solid-black font-heavy uppercase border-[3px] border-solid-black py-2 brutal-shadow-sm hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmAction}
                disabled={processing}
                className={`text-white font-heavy uppercase border-[3px] border-solid-black py-2 brutal-shadow-sm hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${modalState.type === 'approve' ? 'bg-solid-green' : modalState.type === 'restore' ? 'bg-solid-yellow !text-solid-black' : 'bg-red-500'}`}
              >
                {processing ? <i className="fa-solid fa-spinner fa-spin"></i> : (modalState.type === 'approve' ? 'Sí, Aprobar' : modalState.type === 'reject' ? 'Sí, Rechazar' : modalState.type === 'restore' ? 'Sí, Restaurar' : 'Sí, Eliminar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
