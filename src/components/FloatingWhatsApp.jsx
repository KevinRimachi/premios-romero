"use client";

import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // Ocultar si estamos en cualquier ruta de administrador
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href="https://wa.me/51900031628?text=Hola,%20quiero%20más%20información"
      target="_blank"
      rel="noopener noreferrer"
      className="md:hidden fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-4 z-[90] bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center border-2 border-solid-black brutal-shadow hover:bg-[#128C7E] transition-colors cursor-pointer"
      aria-label="Soporte por WhatsApp"
    >
      <i className="fa-brands fa-whatsapp text-3xl"></i>
    </a>
  );
}
