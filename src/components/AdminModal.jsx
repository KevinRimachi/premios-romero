import { useState } from "react";
import { getAllTickets } from "@/services/ticketService";
import { verifyAdminPassword } from "@/app/actions/adminActions";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function AdminModal({ isOpen, onClose }) {
  const [secretCode, setSecretCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingImages, setIsDownloadingImages] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const isValid = await verifyAdminPassword(secretCode);
      if (isValid) {
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Código secreto incorrecto.");
      }
    } catch (err) {
      setError("Error al verificar el código.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    try {
      const tickets = await getAllTickets();
      
      // Formatear datos para XLSX
      const excelData = tickets.map(t => {
        let fecha = "";
        if (t.createdAt && t.createdAt.toDate) {
          fecha = t.createdAt.toDate().toLocaleString("es-PE");
        }
        return {
          "Ticket": t.ticket_numero || "",
          "DNI": t.dni || "",
          "Nombres": t.nombres || "",
          "Apellidos": t.apellidos || "",
          "WhatsApp": t.whatsapp || "",
          "Departamento": t.departamento || "",
          "Sorteo": t.sorteo || "",
          "N° Operacion": t.numero_operacion || "",
          "Estado": t.estado || "",
          "Fecha Registro": fecha,
          "Voucher URL": t.comprobanteUrl || ""
        };
      });

      // Crear hoja y libro de cálculo
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Participantes");

      // Descargar archivo .xlsx
      XLSX.writeFile(workbook, `participantes_romero_${new Date().getTime()}.xlsx`);
      
    } catch (error) {
      console.error("Error descargando datos:", error);
      alert("Hubo un error al descargar los datos desde Firebase.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadImages = async () => {
    setIsDownloadingImages(true);
    setDownloadProgress(0);
    try {
      const tickets = await getAllTickets();
      const zip = new JSZip();
      
      const ticketsWithImages = tickets.filter(t => t.comprobanteUrl);
      
      if (ticketsWithImages.length === 0) {
        alert("No hay imágenes de comprobantes para descargar.");
        setIsDownloadingImages(false);
        return;
      }

      let count = 0;
      for (const t of ticketsWithImages) {
        try {
          const response = await fetch(t.comprobanteUrl);
          if (!response.ok) {
            console.warn(`No se pudo descargar la imagen para el ticket ${t.ticket_numero} (Estado: ${response.status}). Posiblemente fue eliminada.`);
            count++;
            setDownloadProgress(Math.round((count / ticketsWithImages.length) * 100));
            continue;
          }
          const blob = await response.blob();
          
          let extension = "jpg";
          const urlParts = t.comprobanteUrl.split(".");
          if (urlParts.length > 1) {
             const ext = urlParts.pop().toLowerCase();
             if (ext.startsWith("jpg") || ext.startsWith("jpeg")) extension = "jpg";
             else if (ext.startsWith("png")) extension = "png";
             else if (ext.startsWith("webp")) extension = "webp";
          }

          const rawFileName = `${t.ticket_numero || "SIN-TICKET"}_${t.nombres || "SIN-NOMBRE"}_${t.apellidos || ""}`;
          const cleanFileName = rawFileName.replace(/[^a-zA-Z0-9.\-_]/g, "_") + "." + extension;
          
          zip.file(cleanFileName, blob);
        } catch (error) {
          console.warn(`Error de red al descargar imagen de ${t.ticket_numero}:`, error.message);
        }
        
        count++;
        setDownloadProgress(Math.round((count / ticketsWithImages.length) * 100));
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `comprobantes_romero_${new Date().getTime()}.zip`);
      
    } catch (error) {
      console.error("Error al crear el ZIP:", error);
      alert("Hubo un error al generar el archivo ZIP de imágenes.");
    } finally {
      setIsDownloadingImages(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white border-4 border-solid-black p-6 brutal-shadow">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 border-2 border-solid-black text-white font-black text-lg brutal-shadow hover:bg-red-700 flex items-center justify-center z-20 transition-colors"
        >
          X
        </button>

        <h2 className="font-heavy text-2xl uppercase mb-6 border-b-4 border-solid-black pb-2 text-center flex items-center justify-center gap-2">
          <i className="fa-solid fa-user-shield"></i> Panel Admin
        </h2>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-bold uppercase mb-2 text-center">Ingresar Código Secreto:</label>
              <input
                type="password"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                className="brutal-input w-full text-center tracking-widest text-xl"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-600 font-bold text-sm text-center bg-red-50 p-2 border border-red-200">{error}</p>}
            <button
              type="submit"
              disabled={isVerifying}
              className={`w-full bg-solid-black text-white font-heavy text-xl py-3 border-2 border-solid-black brutal-shadow transition-colors mt-2 ${isVerifying ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            >
              {isVerifying ? "VERIFICANDO..." : "ACCEDER"}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <p className="font-bold text-center text-green-700 bg-green-100 p-2 border-2 border-green-600">
              <i className="fa-solid fa-circle-check"></i> Acceso Autorizado
            </p>
            
            <button
              onClick={handleDownloadExcel}
              disabled={isDownloading}
              className={`w-full bg-solid-green text-white font-heavy text-lg py-3 px-4 border-2 border-solid-black brutal-shadow flex items-center justify-center gap-2 transition-colors ${isDownloading ? "opacity-70 pointer-events-none" : "hover:bg-green-600"}`}
            >
              {isDownloading ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> GENERANDO EXCEL...</>
              ) : (
                <><i className="fa-solid fa-file-excel"></i> DESCARGAR DATOS</>
              )}
            </button>

            <button
              onClick={handleDownloadImages}
              disabled={isDownloadingImages}
              className={`w-full bg-solid-blue text-white font-heavy text-lg py-3 px-4 border-2 border-solid-black brutal-shadow flex items-center justify-center gap-2 transition-colors mt-4 ${isDownloadingImages ? "opacity-70 pointer-events-none" : "hover:bg-blue-700"}`}
            >
              {isDownloadingImages ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> DESCARGANDO IMÁGENES ({downloadProgress}%)</>
              ) : (
                <><i className="fa-solid fa-images"></i> DESCARGAR IMÁGENES (ZIP)</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
