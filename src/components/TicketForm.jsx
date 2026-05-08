"use client";

import { useState } from "react";
import { uploadImageToCloudinary } from "@/services/uploadService";
import { saveTicketData } from "@/services/ticketService";
import TermsModal from "./TermsModal";
export default function TicketForm({ isOpen, onClose, selectedDraw, onSuccess }) {
  const [pagoMetodo, setPagoMetodo] = useState("yape");
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [formData, setFormData] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    whatsapp: "",
    departamento: "",
    numero_operacion: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorOp, setErrorOp] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  if (!isOpen) return null;

  const handlePagoChange = (metodo) => setPagoMetodo(metodo);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setComprobanteFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.id === "numero_operacion") setErrorOp(false);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!comprobanteFile) {
      alert("Por favor adjunta el comprobante.");
      return;
    }

    setIsSubmitting(true);

    try {
      const comprobante_url = await uploadImageToCloudinary(comprobanteFile);
      const ticket_numero = "COD-" + Math.floor(1000 + Math.random() * 9000);
      const docData = {
        dni: formData.dni,
        nombres: formData.nombres,
        apellidos: formData.apellidos || "",
        whatsapp: formData.whatsapp,
        departamento: formData.departamento,
        sorteo: selectedDraw ? selectedDraw.name : "Junio",
        numero_operacion: formData.numero_operacion,
        ticket_numero: ticket_numero,
      };

      await saveTicketData(docData, comprobante_url);
      onSuccess(docData);
    } catch (error) {
      console.error("Error en la operación:", error);
      alert("Ocurrió un error: " + error.message);
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
          className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 border-2 border-solid-black text-white font-black text-lg brutal-shadow hover:bg-red-600 flex items-center justify-center z-20"
        >
          X
        </button>

        {/* Área con scroll interno (cuando el contenido excede la altura de la pantalla) */}
        <div className="bg-white border-4 border-solid-black p-5 sm:p-6 brutal-shadow max-h-[90vh] overflow-y-auto">
          {/* Encabezado */}
          <div className="border-b-4 border-solid-black pb-3 mb-4">
            <h2 className="font-heavy text-2xl sm:text-3xl uppercase leading-tight">
              Caja Segura
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
              <p className="font-bold text-gray-600 bg-gray-200 px-2 py-1 text-sm border border-black truncate">
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
                  <input
                    type="number"
                    id="dni"
                    required
                    value={formData.dni}
                    onChange={handleInputChange}
                    className="brutal-input w-full"
                    placeholder="8 dígitos"
                    maxLength="8"
                  />
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
                      className="brutal-input w-full"
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
                      className="brutal-input w-full"
                      placeholder="Tus apellidos"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase mb-1 text-xs sm:text-sm">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="brutal-input w-full"
                      placeholder="Celular"
                    />
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
                    <p className="font-bold text-gray-500 uppercase mb-0.5 text-xs">
                      Escanea y paga a:
                    </p>
                    <p className="font-heavy text-base sm:text-lg text-solid-black leading-tight">
                      MANUEL ROMERO ZELADA <br />
                    </p>
                    <p className="font-heavy text-base sm:text-lg text-solid-pink leading-tight">
                      983001926 <br />
                    </p>
                  </div>
                </div>

                {/* N° Operación y adjunto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase mb-1 text-xs sm:text-sm text-solid-blue">
                      N° Operación
                    </label>
                    <input
                      type="number"
                      id="numero_operacion"
                      required
                      value={formData.numero_operacion}
                      onChange={handleInputChange}
                      className={`brutal-input w-full ${errorOp ? "border-red-500 bg-red-50" : ""}`}
                      placeholder="123456"
                      maxLength="6"
                    />
                    {errorOp && (
                      <p className="text-red-600 font-bold text-xs mt-1">
                        ⚠ Código duplicado.
                      </p>
                    )}
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
              className={`w-full bg-solid-green text-white font-heavy text-xl sm:text-2xl py-3 border-4 border-solid-black brutal-shadow uppercase tracking-wide transition-colors ${isSubmitting ? "opacity-80 pointer-events-none" : "hover:bg-green-600"
                }`}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i> ENVIANDO...
                </>
              ) : (
                "Generar Ticket Digital"
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
              className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 border-2 border-solid-black text-white font-black text-lg brutal-shadow hover:bg-red-700 flex items-center justify-center z-20 transition-colors"
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
    </div>
  );
}