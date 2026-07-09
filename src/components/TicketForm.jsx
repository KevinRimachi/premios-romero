"use client";

import { useState, useRef, useEffect } from "react";
import { uploadImageToCloudinary } from "@/services/uploadService";
import { saveTicketData } from "@/services/ticketService";
import TermsModal from "./TermsModal";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// Helper to calculate file hash (SHA-256)
const calculateImageHash = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

const TICKET_PRICE = 10; // S/ 10.00 per ticket

export default function TicketForm({ isOpen, onClose, selectedDraw, onSuccess }) {

  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [formData, setFormData] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    whatsapp: "",
    departamento: "",
  });

  const [dniOtp, setDniOtp] = useState(Array(8).fill(""));
  const dniRefs = useRef([]);
  const [cantidadTickets, setCantidadTickets] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const [isSearchingDni, setIsSearchingDni] = useState(false);
  const [dniSearchMessage, setDniSearchMessage] = useState("");
  const [isDniMatched, setIsDniMatched] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Custom error modal state

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setDniOtp(Array(8).fill(""));
      setFormData({
        dni: "",
        nombres: "",
        apellidos: "",
        whatsapp: "",
        departamento: "",
      });
      setCantidadTickets(1);
      setDniSearchMessage("");
      setIsDniMatched(false);
      setComprobanteFile(null);
      setErrorMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;


  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setComprobanteFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // WhatsApp validation: allow only numbers and max 9 characters
    if (id === "whatsapp") {
      if (value !== "" && !/^\d+$/.test(value)) return;
      if (value.length > 9) return;
    }

    setFormData({ ...formData, [id]: value });
  };

  const triggerAutoSearch = async (completeDni) => {
    setIsSearchingDni(true);
    setDniSearchMessage("");
    try {
      const docRef = doc(db, "clientes", completeDni);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setFormData((prev) => ({
          ...prev,
          dni: completeDni,
          nombres: userData.nombres || "",
          apellidos: userData.apellidos || "",
          whatsapp: userData.whatsapp || "",
          departamento: userData.departamento || "",
        }));
        setIsDniMatched(true);
        setDniSearchMessage("✓ Usuario registrado anteriormente. Datos completados.");
      } else {
        setFormData((prev) => ({
          ...prev,
          dni: completeDni,
          nombres: "",
          apellidos: "",
          whatsapp: "",
          departamento: "",
        }));
        setIsDniMatched(false);
        setDniSearchMessage("No te has registrado anteriormente, por favor complete sus datos");
      }
    } catch (error) {
      console.error("Error buscando DNI:", error);
      setDniSearchMessage("Error al conectar con la base de datos.");
    } finally {
      setIsSearchingDni(false);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const completeDni = dniOtp.join("");
    if (completeDni.length !== 8) {
      setErrorMessage("Por favor complete los 8 dígitos del DNI.");
      return;
    }

    const isWhatsappValid = formData.whatsapp.length === 9 && /^\d{9}$/.test(formData.whatsapp);
    if (!isWhatsappValid) {
      setErrorMessage("El número de WhatsApp debe tener exactamente 9 dígitos numéricos.");
      return;
    }

    if (!comprobanteFile) {
      setErrorMessage("Por favor adjunta el comprobante de pago.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Calculate file hash
      const imageHash = await calculateImageHash(comprobanteFile);

      // 2. Check if hash exists in Firestore to prevent duplicates
      const q = query(collection(db, "participantes"), where("comprobanteHash", "==", imageHash));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setErrorMessage("¡Voucher duplicado! El voucher ya ha sido utilizada anteriormente para registrar un ticket. Por favor, sube una captura válida y única.");
        setIsSubmitting(false);
        return;
      }

      const comprobante_url = await uploadImageToCloudinary(comprobanteFile);
      const totalPagar = cantidadTickets * TICKET_PRICE;

      const ticket_numeros = [];

      // Save each ticket as a separate document in Firestore
      for (let i = 0; i < cantidadTickets; i++) {
        const ticket_numero = "COD-" + Math.floor(1000 + Math.random() * 9000);
        ticket_numeros.push(ticket_numero);

        const docData = {
          dni: completeDni,
          nombres: formData.nombres,
          apellidos: formData.apellidos || "",
          whatsapp: formData.whatsapp,
          departamento: formData.departamento,
          sorteo: selectedDraw ? selectedDraw.name : "30 de Agosto",
          monto_pago: TICKET_PRICE, // individual value (S/ 10.00)
          monto_total: totalPagar,
          ticket_numero: ticket_numero,
        };

        await saveTicketData(docData, comprobante_url, imageHash);
      }

      // 4. Guardar info del usuario en "clientes" para el autocompletado futuro
      const clienteRef = doc(db, "clientes", completeDni);
      await setDoc(clienteRef, {
        dni: completeDni,
        nombres: formData.nombres,
        apellidos: formData.apellidos || "",
        whatsapp: formData.whatsapp,
        departamento: formData.departamento,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Success payload
      const successPayload = {
        dni: completeDni,
        nombres: formData.nombres,
        apellidos: formData.apellidos || "",
        whatsapp: formData.whatsapp,
        departamento: formData.departamento,
        sorteo: selectedDraw ? selectedDraw.name : "30 de Agosto",
        monto_pago: totalPagar,
        ticket_numeros: ticket_numeros,
        ticket_numero: ticket_numeros[0]
      };

      onSuccess(successPayload);
    } catch (error) {
      console.error("Error en la operación:", error);
      setErrorMessage("Ocurrió un error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Contenedor principal con posición relativa para el botón cerrar */}
      <div className="relative w-full max-w-5xl my-4 sm:my-8">
        {/* Botón cerrar – siempre visible, fuera del área con scroll */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 border-2 border-solid-black text-white font-black text-lg brutal-shadow hover:bg-red-650 flex items-center justify-center z-20"
        >
          X
        </button>

        {/* Área con scroll interno */}
        <div className="bg-white border-4 border-solid-black p-5 sm:p-6 brutal-shadow max-h-[90vh] overflow-y-auto">
          {/* Encabezado */}
          <div className="border-b-4 border-solid-black pb-3 mb-4">
            <h2 className="font-heavy text-2xl sm:text-3xl uppercase leading-tight">
              Caja Segura
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
              <p className="font-bold text-gray-650 bg-gray-200 px-2 py-1 text-sm border border-black truncate">
                {selectedDraw
                  ? `SORTEO ${selectedDraw.name.toUpperCase()} - ${selectedDraw.prize}`
                  : "SORTEO X"}
              </p>
              <p className="font-heavy text-xl sm:text-2xl bg-solid-yellow px-3 py-1 border-2 border-black inline-block self-start sm:self-auto">
                S/ {selectedDraw ? selectedDraw.price : "0"}.00
              </p>
            </div>
          </div>

          <form onSubmit={submitForm} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Datos personales */}
              <div className="space-y-4">
                <h3 className="font-heavy text-lg uppercase bg-solid-black text-white px-3 py-1 inline-block border-2 border-solid-black">
                  1. Datos Personales
                </h3>

                <div>
                  <label className="block font-bold uppercase mb-1 text-xs sm:text-sm">
                    Número de DNI
                  </label>
                  <div className="grid grid-cols-8 gap-1 sm:gap-2 w-full">
                    {Array(8).fill(0).map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength="1"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        ref={(el) => (dniRefs.current[i] = el)}
                        value={dniOtp[i] || ""}
                        onPaste={(e) => {
                          const pasted = e.clipboardData.getData("text").trim();
                          if (/^\d{8}$/.test(pasted)) {
                            e.preventDefault();
                            const digits = pasted.split("");
                            setDniOtp(digits);
                            dniRefs.current[7].focus();
                            triggerAutoSearch(pasted);
                          }
                        }}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !/^\d$/.test(val)) return;
                          const newDni = [...dniOtp];
                          newDni[i] = val;
                          setDniOtp(newDni);

                          // Focus next input if digit entered
                          if (val !== "" && i < 7) {
                            dniRefs.current[i + 1].focus();
                          }

                          // Trigger query if all 8 filled
                          const completeDni = newDni.join("");
                          if (completeDni.length === 8) {
                            triggerAutoSearch(completeDni);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            if (dniOtp[i] === "" && i > 0) {
                              const newDni = [...dniOtp];
                              newDni[i - 1] = "";
                              setDniOtp(newDni);
                              dniRefs.current[i - 1].focus();
                              setIsDniMatched(false);
                              setDniSearchMessage("");
                            } else {
                              const newDni = [...dniOtp];
                              newDni[i] = "";
                              setDniOtp(newDni);
                              setIsDniMatched(false);
                              setDniSearchMessage("");
                            }
                          }
                        }}
                        className="brutal-input w-full text-center text-lg sm:text-xl font-heavy h-11 sm:h-12 bg-white text-black"
                        style={{ border: '3px solid black', padding: 0 }}
                      />
                    ))}
                  </div>
                  {isSearchingDni && (
                    <p className="text-gray-550 text-xs font-bold mt-1">
                      <i className="fa-solid fa-spinner fa-spin mr-1"></i> Buscando DNI...
                    </p>
                  )}
                  {dniSearchMessage && (
                    <p className={`text-xs font-bold mt-1 ${isDniMatched ? "text-green-700" : "text-solid-pink"}`}>
                      {dniSearchMessage}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase mb-1 text-xs sm:text-sm">
                      Nombres
                    </label>
                    <input
                      type="text"
                      id="nombres"
                      required
                      value={formData.nombres}
                      onChange={handleInputChange}
                      readOnly={isDniMatched}
                      className={`brutal-input w-full ${isDniMatched ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-400" : ""}`}
                      placeholder="Tus nombres"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1 text-xs sm:text-sm">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      id="apellidos"
                      required
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      readOnly={isDniMatched}
                      className={`brutal-input w-full ${isDniMatched ? "bg-gray-100 text-gray-550 cursor-not-allowed border-gray-400" : ""}`}
                      placeholder="Tus apellidos"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase mb-1 text-xs sm:text-sm">
                      WhatsApp (9 dígitos)
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className={`brutal-input w-full ${formData.whatsapp && formData.whatsapp.length !== 9 ? 'border-red-500 bg-red-50' : ''}`}
                      placeholder="Celular"
                    />
                    {formData.whatsapp && formData.whatsapp.length !== 9 && (
                      <p className="text-solid-pink font-bold text-xs mt-1">
                        ⚠ Debe tener exactamente 9 dígitos.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1 text-xs sm:text-sm">
                      Departamento
                    </label>
                    <div className="relative">
                      <select
                        id="departamento"
                        required
                        value={formData.departamento}
                        onChange={handleInputChange}
                        className="brutal-input bg-white cursor-pointer w-full appearance-none"
                      >
                        <option value="" disabled>Selecciona</option>
                        <option value="Amazonas">Amazonas</option>
                        <option value="Ancash">Áncash</option>
                        <option value="Ayacucho">Ayacucho</option>
                        <option value="Cajamarca">Cajamarca</option>
                        <option value="Callao">Callao</option>
                        <option value="Cusco">Cusco</option>
                        <option value="Huancavelica">Huancavelica</option>
                        <option value="Huanuco">Huánuco</option>
                        <option value="Ica">Ica</option>
                        <option value="Junin">Junín</option>
                        <option value="La Libertad">La Libertad</option>
                        <option value="Lambayeque">Lambayeque</option>
                        <option value="Lima">Lima</option>
                        <option value="Loreto">Loreto</option>
                        <option value="Madre de Dios">Madre de Dios</option>
                        <option value="Moquegua">Moquegua</option>
                        <option value="Pasco">Pasco</option>
                        <option value="Tumbes">Tumbes</option>
                        <option value="Ucayali">Ucayali</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 text-sm">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 bg-gray-50 border-2 border-solid-black p-3">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="w-5 h-5 border-2 border-solid-black mt-0.5 cursor-pointer accent-solid-black shrink-0"
                    />
                    <span className="font-bold text-xs sm:text-sm leading-tight text-gray-700">
                      Acepto los{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsTermsModalOpen(true);
                        }}
                        className="text-solid-blue underline hover:text-blue-800"
                      >
                        términos y condiciones
                      </button>{" "}
                      de los sorteos.
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="w-5 h-5 border-2 border-solid-black mt-0.5 cursor-pointer accent-solid-pink shrink-0"
                    />
                    <span className="font-bold text-xs sm:text-sm leading-tight text-solid-pink">
                      Solo para mayores de 18 años. Juega responsablemente.
                    </span>
                  </label>
                </div>
              </div>

              {/* Pago y comprobante */}
              <div className="space-y-4 bg-gray-100 border-2 border-solid-black p-4">
                <h3 className="font-heavy text-lg uppercase bg-solid-black text-white px-3 py-1 inline-block border-2 border-solid-black">
                  2. Pago y Verificación
                </h3>

                {/* QR e info (Solo Yape) */}
                <div className="bg-white border-2 border-solid-black p-3 flex items-center justify-center gap-3">
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => setIsQrModalOpen(true)}
                    title="Click para ver QR más grande"
                  >
                    <img
                      src="/yape.webp"
                      alt="QR Yape"
                      className="border-2 border-solid-black p-1 bg-white w-20 h-20 object-contain shrink-0 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                      <span className="text-xl font-black drop-shadow-md">🔍</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-gray-550 uppercase mb-0.5 text-xs">
                      Yape y Plin:
                    </p>
                    <p className="font-heavy text-base sm:text-lg text-solid-black leading-tight">
                      MANUEL ROMERO ZELADA <br />
                    </p>
                    <p className="font-heavy text-base sm:text-lg text-solid-pink leading-tight">
                      900 031 628 <br />
                    </p>
                  </div>
                </div>

                {/* Cantidad de Tickets Selector y adjunto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="block font-bold uppercase text-xs sm:text-sm text-solid-blue">
                      Cantidad de Tickets
                    </label>

                    {/* Contador estilo el de la imagen */}
                    <div className="flex items-center justify-between border-2 border-solid-black bg-white rounded-lg p-1.5 w-full brutal-shadow">
                      <button
                        type="button"
                        onClick={() => setCantidadTickets((prev) => Math.max(1, prev - 1))}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 border-2 border-solid-black font-black text-xl rounded flex items-center justify-center transition-colors cursor-pointer select-none"
                      >
                        -
                      </button>
                      <span className="font-heavy text-xl text-solid-black select-none">
                        {cantidadTickets}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCantidadTickets((prev) => prev + 1)}
                        className="w-10 h-10 bg-green-100 hover:bg-green-200 border-2 border-solid-black font-black text-xl text-green-700 rounded flex items-center justify-center transition-colors cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>

                    {/* Total a Pagar */}
                    <div className="bg-red-50 border-2 border-red-200 p-2 rounded-lg flex items-center justify-between text-solid-pink mt-1 brutal-shadow">
                      <span className="font-bold text-[10px] sm:text-xs">
                        Total a Pagar ({cantidadTickets} ticket{cantidadTickets > 1 ? 's' : ''}):
                      </span>
                      <span className="font-heavy text-lg">
                        S/ {(cantidadTickets * TICKET_PRICE).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase mb-1 text-xs sm:text-sm">
                      Adjunta Captura
                    </label>
                    <input
                      type="file"
                      id="comprobante"
                      accept="image/*"
                      className="hidden"
                      required
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="comprobante"
                      className={`w-full h-[52px] border-2 flex flex-col items-center justify-center cursor-pointer transition text-center ${comprobanteFile
                        ? "bg-green-50 border-green-500"
                        : "bg-white border-dashed border-solid-black hover:bg-gray-50"
                        }`}
                    >
                      {comprobanteFile ? (
                        <span className="font-bold text-sm text-green-700 truncate px-1">
                          ✓ {comprobanteFile.name.substring(0, 12)}...
                        </span>
                      ) : (
                        <span className="font-bold text-sm">
                          📷 SUBIR FOTO
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-solid-black text-white font-heavy text-xl sm:text-2xl py-3 border-4 border-solid-black brutal-shadow uppercase tracking-wide transition-transform ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1 hover:bg-gray-800"
              }`}
            >
              {isSubmitting ? (
                <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Procesando...</>
              ) : (
                "Registrar Compra"
              )}
            </button>
          </form>
        </div>
      </div>
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />

      {/* Modal QR Ampliado */}
      {isQrModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            className="relative max-w-sm w-full bg-white border-4 border-solid-black p-5 brutal-shadow flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 border-2 border-solid-black text-white font-black text-lg brutal-shadow hover:bg-red-750 flex items-center justify-center z-20 transition-colors"
            >
              X
            </button>
            <h3 className="font-heavy text-xl sm:text-2xl uppercase mb-3 text-center border-b-4 border-solid-black w-full pb-2">
              ESCANEA Y PAGA
            </h3>
            <div className="w-full bg-gray-100 border-2 border-solid-black p-2 mb-3">
              <img
                src="/yape.webp"
                alt="QR Yape Grande"
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="font-bold text-center text-sm sm:text-lg text-gray-700">
              Escanea para pagar a:
            </p>
            <p className="font-heavy text-lg sm:text-xl text-center text-solid-black mt-1 leading-tight">
              MANUEL ROMERO ZELADA
            </p>
            <p className="font-heavy text-lg sm:text-xl text-center text-solid-pink mt-1 leading-tight">
              983001926
            </p>
          </div>
        </div>
      )}

      {/* Modal de Error Personalizado */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border-4 border-solid-black p-6 brutal-shadow text-center">
            <div className="w-16 h-16 bg-solid-pink rounded-full border-4 border-solid-black flex items-center justify-center mx-auto mb-4 brutal-shadow">
              <span className="text-white text-3xl font-black">!</span>
            </div>
            <h3 className="font-heavy text-2xl uppercase mb-3 text-solid-black">
              Alerta
            </h3>
            <p className="font-bold text-gray-700 text-lg mb-6">
              {errorMessage}
            </p>
            <button
              onClick={() => setErrorMessage("")}
              className="w-full bg-solid-black text-white font-heavy text-xl py-3 border-4 border-solid-black brutal-shadow hover:bg-gray-800 uppercase transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}