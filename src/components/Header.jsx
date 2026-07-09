import { useState } from "react";

export default function Header({ onOpenTickets }) {
  return (
    <header className="bg-solid-yellow border-b-[3px] border-solid-black sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer">
          <img
            src="/logo_premios_Romero.webp"
            alt="Logo Premios Romero"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-solid-black object-cover bg-white"
          />
          <h1 className="font-heavy text-xl md:text-2xl leading-none uppercase tracking-wide">
            Premios Romero
          </h1>
        </div>

        <div className="flex gap-2 md:gap-4 flex-wrap justify-end">
          <a
            href="https://www.facebook.com/manuel.romero.915577"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border-2 border-solid-black text-solid-black px-2 md:px-3 py-1.5 text-sm font-bold flex items-center gap-2 hover:bg-gray-100 brutal-shadow"
          >
            <i className="fa-brands fa-facebook text-[#1877F2] text-lg"></i>
            <span className="hidden md:inline">Facebook</span>
          </a>

          <a
            href="https://wa.me/51900031628?text=Hola,%20quiero%20más%20información"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex bg-white border-2 border-solid-black text-solid-black px-2 md:px-3 py-1.5 text-sm font-bold items-center gap-2 hover:bg-gray-100 brutal-shadow"
          >
            <i className="fa-brands fa-whatsapp text-green-600 text-lg"></i>
            <span>Soporte</span>
          </a>

          <button
            onClick={onOpenTickets}
            className="bg-solid-black text-white border-2 border-solid-black px-3 md:px-5 py-1.5 text-xs md:text-sm font-bold flex items-center gap-2 brutal-shadow"
          >
            <i className="fa-solid fa-ticket-simple"></i>{" "}
            <span className="hidden sm:inline">Mis Tickets</span>
          </button>
        </div>
      </div>
    </header>
  );
}
