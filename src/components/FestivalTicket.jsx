"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function FestivalTicket({ ticket, fireConfetti = false }) {
  useEffect(() => {
    if (fireConfetti) {
      const duration = 2500;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 150 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Confetti
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#8A2BE2', '#FFFFFF', '#9400D3']
        });
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#8A2BE2', '#FFFFFF', '#9400D3']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [fireConfetti]);

  const barcodePattern1 = [2, 1, 4, 1, 1, 3, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 2];
  const barcodePattern2 = [1, 3, 1, 2, 2, 1, 4, 1, 1, 2, 3, 1, 2, 1, 1, 2];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-row font-sans my-2 sm:my-4 shadow-xl rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 border border-purple-900/50 min-h-[140px] sm:min-h-0 shrink-0">
      
      {/* MAIN SECTION */}
      <div 
        className="w-[75%] sm:w-auto sm:flex-1 text-white p-2.5 sm:p-6 relative flex flex-col sm:flex-row overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #360066 0%, #5a00a3 100%)' }}
      >
        {/* Curvas decorativas en el fondo imitando el estilo deportivo */}
        <div className="absolute -top-16 -left-16 w-32 h-32 sm:w-48 sm:h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-full h-16 sm:h-24 bg-yellow-400/10 transform skew-y-6 translate-y-8"></div>
        
        {/* MOBILE TOP ROW (Logo + Header) / DESKTOP LOGO AREA */}
        <div className="flex flex-row sm:flex-col sm:w-2/5 relative z-10 items-center sm:items-center justify-between sm:justify-center mb-2 sm:mb-0 sm:pr-4">
          
          {/* Logo Area */}
          <div className="w-1/2 sm:w-full transform -rotate-6 sm:-rotate-12 hover:rotate-0 transition-transform duration-500 text-left sm:text-center shrink-0">
            <h2 className="text-[16px] sm:text-4xl font-black italic text-yellow-400 leading-none tracking-tighter" style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.8)" }}>
              PREMIOS
            </h2>
            <h2 className="text-[14px] sm:text-3xl font-black italic text-white leading-none tracking-tight mt-0.5 sm:mt-1" style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.8)" }}>
              ROMERO
            </h2>
            <div className="bg-yellow-400 text-black font-black italic text-[7px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 mt-1 sm:mt-2 inline-block transform -skew-x-12 shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
              ALL STARS
            </div>
          </div>

          {/* Header Area (Solo visible aquí en Móvil, en Desktop está en el Middle Data Area) */}
          <div className="w-1/2 sm:hidden pl-3 flex flex-col justify-center">
            <p className="text-yellow-400 font-bold text-[7px] uppercase tracking-[0.2em] mb-0.5">
              Ticket Oficial
            </p>
            <h3 className="text-[13px] font-black uppercase tracking-wide leading-tight">
              {ticket.sorteo || "Sorteo Actual"}
            </h3>
            <p className="text-[6px] text-purple-200 mt-0.5 uppercase tracking-widest font-semibold leading-tight">
              Válido para el evento<br/>principal
            </p>
          </div>
        </div>

        {/* MIDDLE DATA AREA (Boxes) */}
        <div className="w-full sm:w-3/5 sm:pl-6 border-t border-white/20 sm:border-t-0 sm:border-l flex flex-col flex-1 pt-2 sm:pt-0 relative z-10 gap-1.5 sm:gap-0 sm:justify-between">
          
          {/* Header (Solo Desktop) */}
          <div className="hidden sm:block">
            <p className="text-yellow-400 font-bold text-[9px] uppercase tracking-[0.2em] mb-0.5">
              Ticket Oficial
            </p>
            <h3 className="text-xl font-black uppercase tracking-wide leading-tight">
              {ticket.sorteo || "Sorteo Actual"}
            </h3>
            <p className="text-[9px] text-purple-200 mt-0.5 uppercase tracking-widest font-semibold">
              Válido para el evento principal
            </p>
          </div>

          {/* Grid boxes for data */}
          <div className="flex flex-col gap-1.5 sm:gap-2 mt-0 sm:mt-4">
            
            {/* Fila 1: DNI (Mobile) / DNI (Desktop) */}
            <div className="flex gap-1.5 sm:gap-2">
              <div className="border border-white/20 bg-white/5 rounded p-1 sm:p-2 flex flex-col sm:flex-row sm:items-center justify-between flex-1">
                <span className="text-[7px] sm:text-[9px] text-purple-300 font-bold uppercase mb-0.5 sm:mb-0">DNI</span>
                <span className="text-[9px] sm:text-base font-bold text-white text-left sm:text-right truncate">{ticket.dni}</span>
              </div>
              
              {/* En Mobile, Valor está en la fila 1. En Desktop, Valor está en su propia fila. */}
              <div className="border border-white/20 bg-white/5 rounded p-1 sm:p-2 flex sm:hidden flex-col justify-between flex-1">
                <span className="text-[7px] text-purple-300 font-bold uppercase mb-0.5">Valor</span>
                <span className="text-[9px] font-bold text-yellow-400 text-left truncate">S/ {ticket.monto_pago || "20.00"}</span>
              </div>
            </div>

            {/* Valor (Desktop) */}
            <div className="hidden sm:flex border border-white/20 bg-white/5 rounded p-2 items-center justify-between">
              <span className="text-[9px] text-purple-300 font-bold uppercase w-1/3">Valor</span>
              <span className="text-base font-bold text-yellow-400 w-2/3 text-right truncate">S/ {ticket.monto_pago || "20.00"}</span>
            </div>

            {/* Participante */}
            <div className="border border-white/20 bg-white/5 rounded p-1.5 sm:p-2 flex flex-col sm:flex-row sm:items-center justify-between">
              <span className="text-[7px] sm:text-[9px] text-purple-300 font-bold uppercase mb-0.5 sm:mb-0">Participante</span>
              <span className="text-[9px] sm:text-xs font-black text-white uppercase text-left sm:text-right truncate tracking-wide">
                {ticket.nombres} {ticket.apellidos}
              </span>
            </div>

            {/* Fila 3: Ticket ID & Clase VIP (Solo Mobile) */}
            <div className="flex sm:hidden gap-1.5 mt-0.5">
              <div className="border border-white/20 bg-white/5 rounded p-1 flex flex-col justify-center flex-1">
                <span className="text-[6px] text-purple-300 font-bold uppercase text-center mb-0.5">Ticket ID</span>
                <span className="text-[9px] font-black text-yellow-400 text-center truncate">{ticket.ticket_numero || "000000"}</span>
              </div>
              <div className="border border-yellow-400 bg-transparent rounded p-1 flex flex-col justify-center w-1/3 shrink-0">
                <span className="text-[6px] text-yellow-400 font-bold uppercase text-center mb-0.5">Clase</span>
                <span className="text-[9px] font-black text-yellow-400 text-center">VIP</span>
              </div>
            </div>
          </div>

          {/* Footer Desktop (Nivel VIP & Barcode) */}
          <div className="hidden sm:flex mt-3 justify-between items-end">
            <div className="flex items-center gap-1.5">
               <p className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest">Nivel</p>
               <p className="text-3xl font-black text-white italic drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">VIP</p>
            </div>
            <div className="flex items-center h-8 opacity-70">
              {barcodePattern1.map((w, i) => (
                 <div key={i} className="bg-white h-full" style={{ width: `${w * 1.5}px`, marginRight: '2px' }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT STUB */}
      <div 
        className="w-[25%] sm:w-48 text-white flex flex-col border-l-[2px] border-dashed border-white/40 relative z-10 shrink-0"
        style={{ background: 'linear-gradient(135deg, #2b0057 0%, #1a0033 100%)' }}
      >
        {/* MOBILE STUB */}
        <div className="sm:hidden flex flex-col h-full items-center justify-between p-2 pb-4 overflow-hidden">
          <div className="text-center w-full mt-1">
             <p className="text-yellow-400 font-bold text-[6px] uppercase tracking-[0.1em] mb-0.5 leading-tight">Sorteo Especial</p>
             <h3 className="text-[10px] font-black uppercase tracking-wide leading-none">ROMERO</h3>
             <p className="text-[5px] text-purple-300 mt-0.5 uppercase tracking-widest font-semibold">Código de Acceso</p>
          </div>
          
          <div className="flex-1 flex items-end justify-center pb-2 w-full mt-4">
            <p 
              className="text-[13px] font-black tracking-widest text-yellow-400 break-keep whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              <span className="text-[7px] text-purple-300 font-bold uppercase mr-1">TICKET ID</span>
              {ticket.ticket_numero || "000000"}
            </p>
          </div>
        </div>

        {/* DESKTOP STUB */}
        <div className="hidden sm:flex flex-col h-full justify-between p-4">
          <div className="text-left mb-0">
             <p className="text-yellow-400 font-bold text-[8px] uppercase tracking-[0.2em] mb-1">Sorteo Especial</p>
             <h3 className="text-base font-black uppercase tracking-wide leading-none">ROMERO</h3>
             <p className="text-[8px] text-purple-300 mt-1 uppercase tracking-widest font-semibold">
                Código de Acceso
              </p>
          </div>

          <div className="bg-white/10 rounded-md p-2 text-center my-0 border border-white/20 flex-none">
            <p className="text-[8px] text-purple-300 font-bold uppercase mb-0.5">Ticket ID</p>
            <p className="text-lg font-black tracking-widest text-yellow-400 break-all leading-none">
              {ticket.ticket_numero || "000000"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-0">
            <div className="border border-white/20 bg-white/5 rounded p-1.5 text-center">
              <p className="text-[8px] text-purple-300 font-bold uppercase">DNI</p>
              <p className="text-[10px] font-bold text-white mt-0.5">{ticket.dni}</p>
            </div>
            <div className="border border-yellow-400 bg-yellow-400/20 rounded p-1.5 text-center text-yellow-400">
              <p className="text-[8px] font-bold uppercase">Clase</p>
              <p className="text-[10px] font-black mt-0.5">VIP</p>
            </div>
          </div>

          <div className="flex justify-center items-center h-10 opacity-80 mt-3">
            {barcodePattern2.map((w, i) => (
               <div key={i} className="bg-white h-full" style={{ width: `${w * 1.5}px`, marginRight: '2px' }}></div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
