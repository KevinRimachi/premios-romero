"use client";

import { useState, useEffect } from "react";
import TicketForm from "./TicketForm";
import FestivalTicket from "./FestivalTicket";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Modals({
  isTicketsModalOpen,
  closeTicketsModal,
  isAdminModalOpen,
  closeAdminModal,
  isInactiveModalOpen,
  closeInactiveModal,
  isFormModalOpen,
  closeFormModal,
  selectedDraw,
  onSuccess,
  successData,
  closeSuccessModal,
}) {
  const [adminPass, setAdminPass] = useState("");
  const [exportStatus, setExportStatus] = useState("idle");

  const [searchDni, setSearchDni] = useState("");
  const [searchStatus, setSearchStatus] = useState("idle");
  const [searchResults, setSearchResults] = useState({ approved: [], rejected: 0, pending: 0 });
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [currentSuccessIndex, setCurrentSuccessIndex] = useState(0);

  useEffect(() => {
    if (successData) {
      setCurrentSuccessIndex(0);
    }
  }, [successData]);

  const exportExcel = () => {
    if (adminPass === "LORENZO2026") {
      setExportStatus("loading");
      setTimeout(() => {
        setExportStatus("success");
        setTimeout(() => {
          closeAdminModal();
          setExportStatus("idle");
          setAdminPass("");
        }, 1500);
      }, 1500);
    } else {
      setExportStatus("error");
      setTimeout(() => setExportStatus("idle"), 1500);
    }
  };

  const searchTickets = async () => {
    if (searchDni.length < 8) return;
    setSearchStatus("loading");
    
    try {
      const q = query(
        collection(db, "participantes"), 
        where("dni", "==", searchDni),
        where("sorteo", "==", selectedDraw ? selectedDraw.name : "30 de Agosto")
      );
      const querySnapshot = await getDocs(q);
      const allResults = [];
      querySnapshot.forEach((doc) => {
        allResults.push(doc.data());
      });
      
      const approvedTickets = allResults.filter(r => r.status === "approved");
      const rejectedTickets = allResults.filter(r => r.status === "rejected");
      const pendingTickets = allResults.filter(r => r.status === "pending" || !r.status);
      
      approvedTickets.sort((a, b) => {
        const numA = String(a.ticket_numero || "");
        const numB = String(b.ticket_numero || "");
        return numA.localeCompare(numB);
      });

      setSearchResults({
        approved: approvedTickets,
        rejected: rejectedTickets.length,
        pending: pendingTickets.length
      });
      setCurrentTicketIndex(0);
      setSearchStatus("success");
    } catch (error) {
      console.error("Error buscando tickets:", error);
      setSearchStatus("error");
    }
  };

  return (
    <>
      {/* FORMULARIO MODAL */}
      <TicketForm
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        selectedDraw={selectedDraw}
        onSuccess={onSuccess}
      />

      {/* MODAL DE TICKET DIGITAL (ÉXITO WOW -> Ahora Formal En Revisión) */}
      {successData && (
        <div className="fixed inset-0 bg-[#09090b]/90 backdrop-blur-md z-[110] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border-4 border-solid-black brutal-shadow p-8 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-solid-yellow border-4 border-solid-black brutal-shadow-sm rounded-full flex items-center justify-center text-solid-black mb-6">
              <i className="fa-solid fa-clock-rotate-left text-4xl"></i>
            </div>
            <h3 className="font-heavy text-3xl md:text-4xl uppercase text-solid-black mb-4 leading-none">
              ¡Registro Completado!
            </h3>
            <p className="font-bold text-gray-700 text-lg mb-6 leading-relaxed">
              Su compra se encuentra actualmente en <span className="bg-solid-yellow px-1 border-b-[3px] border-solid-black uppercase">Revisión</span>. Una vez que nuestro equipo valide su comprobante, sus tickets serán aprobados.
            </p>
            <div className="bg-gray-100 p-4 border-[3px] border-solid-black brutal-shadow-sm mb-8 w-full text-left">
              <p className="text-sm font-heavy text-gray-500 uppercase mb-2"><i className="fa-solid fa-circle-info mr-1"></i> Información</p>
              <p className="text-sm font-bold text-gray-700">Para consultar el estado de su compra, diríjase a la opción "Mis Tickets" en el menú principal ingresando su DNI.</p>
            </div>
            <button
              onClick={closeSuccessModal}
              className="w-full bg-solid-black text-white font-heavy text-xl py-4 border-4 border-solid-black brutal-shadow uppercase hover:bg-gray-800 transition-all hover:translate-y-1 hover:shadow-none"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL ADMIN (Puerta Secreta Exportar) */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-solid-black border-4 border-white p-8 text-center brutal-shadow">
            <h3 className="font-heavy text-2xl text-white uppercase mb-4">
              <i className="fa-solid fa-lock text-solid-yellow mr-2"></i>Panel de Control
            </h3>
            <p className="text-gray-400 font-bold text-sm mb-4">Ingresa la clave para exportar BD</p>
            <input
              type="password"
              placeholder="Contraseña..."
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="w-full bg-white border-2 border-solid-black p-3 font-bold text-center mb-4"
            />
            <button
              onClick={exportExcel}
              className={`w-full text-white font-heavy text-xl py-3 border-2 border-white uppercase transition mb-2 ${
                exportStatus === "error"
                  ? "bg-red-500"
                  : exportStatus === "success"
                  ? "bg-solid-blue"
                  : "bg-solid-green hover:bg-green-600"
              }`}
            >
              {exportStatus === "loading" && <><i className="fa-solid fa-spinner fa-spin"></i> CREANDO EXCEL...</>}
              {exportStatus === "success" && <><i className="fa-solid fa-check"></i> DESCARGADO!</>}
              {exportStatus === "error" && "CLAVE INCORRECTA"}
              {exportStatus === "idle" && "Descargar Excel"}
            </button>
            <button
              onClick={closeAdminModal}
              className="w-full text-gray-400 font-bold text-sm underline mt-2 hover:text-white"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL BUSCAR TICKETS */}
      {isTicketsModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className={`w-full relative transition-all duration-300 ${searchStatus === "success" && (searchResults.approved?.length > 0 || searchResults.rejected > 0 || searchResults.pending > 0) ? "max-w-5xl" : "max-w-md bg-white border-4 border-solid-black p-6 sm:p-8 brutal-shadow"}`}>
            
            {searchStatus === "success" && (searchResults.approved?.length > 0 || searchResults.rejected > 0 || searchResults.pending > 0) ? (
              <div className="w-full flex flex-col items-center">
                <button
                  onClick={closeTicketsModal}
                  className="absolute -top-4 -right-2 sm:-top-8 sm:-right-8 w-10 h-10 bg-solid-yellow border-2 border-solid-black text-solid-black font-black text-xl brutal-shadow flex items-center justify-center z-[150] hover:scale-110 transition"
                >
                  X
                </button>
                <h3 className="font-heavy text-2xl sm:text-4xl uppercase mb-4 text-white drop-shadow-[2px_2px_0_#000] text-center">
                  Estado de tus Tickets
                </h3>
                
                <div className="w-full flex flex-col items-center justify-center relative px-2 pb-4">
                  
                  {searchResults.rejected > 0 && (
                    <div className="mb-4 bg-red-100 border-2 border-red-500 text-red-600 font-bold p-4 w-full max-w-2xl text-center brutal-shadow-sm uppercase text-sm flex items-center justify-center gap-2">
                      <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                      Tienes {searchResults.rejected} ticket(s) rechazado(s) por problemas con el pago.
                    </div>
                  )}

                  {searchResults.pending > 0 && (
                    <div className="mb-4 bg-yellow-100 border-2 border-yellow-500 text-yellow-700 font-bold p-4 w-full max-w-2xl text-center brutal-shadow-sm uppercase text-sm flex items-center justify-center gap-2">
                      <i className="fa-solid fa-clock text-xl"></i>
                      Tienes {searchResults.pending} ticket(s) en proceso de revisión.
                    </div>
                  )}

                  {searchResults.approved?.length > 0 && (
                    <>
                      <h4 className="font-heavy text-xl uppercase mb-4 text-solid-green drop-shadow-[1px_1px_0_#000] text-center mt-4">Tickets Aprobados</h4>
                      <FestivalTicket 
                        ticket={searchResults.approved[currentTicketIndex]} 
                        fireConfetti={currentTicketIndex === 0} 
                      />
                      
                      {searchResults.approved.length > 1 && (
                        <div className="flex items-center gap-6 mt-6">
                          <button 
                            onClick={() => setCurrentTicketIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentTicketIndex === 0}
                            className={`w-12 h-12 flex items-center justify-center border-2 border-solid-black brutal-shadow rounded-full ${currentTicketIndex === 0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50' : 'bg-solid-yellow text-solid-black hover:scale-110 hover:bg-yellow-300 transition'}`}
                          >
                            <i className="fa-solid fa-arrow-left text-xl"></i>
                          </button>
                          
                          <div className="flex flex-col items-center">
                            <span className="font-heavy text-xl text-white drop-shadow-[2px_2px_0_#000]">
                              {currentTicketIndex + 1} / {searchResults.approved.length}
                            </span>
                            <span className="text-white text-xs font-bold mt-1 tracking-wider uppercase drop-shadow-[1px_1px_0_#000]">Tickets Aprobados</span>
                          </div>
                          
                          <button 
                            onClick={() => setCurrentTicketIndex(prev => Math.min(searchResults.approved.length - 1, prev + 1))}
                            disabled={currentTicketIndex === searchResults.approved.length - 1}
                            className={`w-12 h-12 flex items-center justify-center border-2 border-solid-black brutal-shadow rounded-full ${currentTicketIndex === searchResults.approved.length - 1 ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50' : 'bg-solid-yellow text-solid-black hover:scale-110 hover:bg-yellow-300 transition'}`}
                          >
                            <i className="fa-solid fa-arrow-right text-xl"></i>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <button
                  onClick={() => setSearchStatus("idle")}
                  className="mt-6 bg-white text-solid-black font-heavy text-lg py-2.5 px-6 border-[3px] border-solid-black brutal-shadow uppercase hover:bg-gray-200 transition"
                >
                  Buscar Otro DNI
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={closeTicketsModal}
                  className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-10 sm:h-10 bg-solid-yellow border-2 border-solid-black text-solid-black font-black text-lg sm:text-xl brutal-shadow flex items-center justify-center hover:scale-110 transition z-50"
                >
                  X
                </button>
                <h3 className="font-heavy text-2xl sm:text-3xl uppercase mb-2">Mis Tickets</h3>
                <p className="font-bold text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
                  Valida tus compras ingresando tu documento.
                </p>
                <input
                  type="number"
                  placeholder="Tu número de DNI"
                  value={searchDni}
                  onChange={(e) => setSearchDni(e.target.value)}
                  className="brutal-input text-center text-lg sm:text-xl mb-4 p-2 sm:p-3"
                  maxLength="8"
                />
                <button
                  onClick={searchTickets}
                  className="w-full bg-solid-black text-white font-heavy text-xl sm:text-2xl py-2 sm:py-3 border-2 border-solid-black brutal-shadow uppercase hover:bg-gray-800 transition"
                >
                  {searchStatus === "loading" ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> BUSCANDO...</>
                  ) : (
                    "Buscar"
                  )}
                </button>
                
                {searchStatus === "success" && searchResults.approved?.length === 0 && searchResults.rejected === 0 && searchResults.pending === 0 && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-100 border-2 border-red-500 text-red-500 font-bold text-xs sm:text-sm">
                    No se encontraron tickets registrados para el DNI {searchDni} en este sorteo.
                  </div>
                )}
                {searchStatus === "error" && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-100 border-2 border-red-500 text-red-500 font-bold text-xs sm:text-sm">
                    Hubo un error al buscar en la base de datos.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL SORTEO INACTIVO */}
      {isInactiveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border-4 border-solid-black p-6 sm:p-8 relative brutal-shadow text-center">
            <button
              onClick={closeInactiveModal}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-10 sm:h-10 bg-solid-yellow border-2 border-solid-black text-solid-black font-black text-lg sm:text-xl brutal-shadow flex items-center justify-center"
            >
              X
            </button>
            <div className="w-16 h-16 bg-solid-pink border-4 border-solid-black text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 brutal-shadow">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h3 className="font-heavy text-2xl sm:text-3xl uppercase mb-2">Sorteo Bloqueado</h3>
            <p className="font-bold text-gray-600 mb-6 text-sm">
              Este sorteo aún no está activo. Las inscripciones se abrirán una vez finalizado el sorteo de Abril.
            </p>
            <button
              onClick={closeInactiveModal}
              className="w-full bg-solid-black text-white font-heavy text-xl py-3 border-2 border-solid-black brutal-shadow uppercase hover:bg-gray-800"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
