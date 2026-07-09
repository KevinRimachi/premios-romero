"use client";

import { useState, useEffect } from "react";

export default function Hero({ onOpenForm, onOpenInactive, onOpenMaintenance }) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    // Agosto 29, 2026 23:59:59
    const countDownDate = new Date("Aug 29, 2026 23:59:59").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days < 10 ? "0" + days : days.toString(),
        hours: hours < 10 ? "0" + hours : hours.toString(),
        minutes: minutes < 10 ? "0" + minutes : minutes.toString(),
        seconds: seconds < 10 ? "0" + seconds : seconds.toString(),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* TEMPORIZADOR FOMO */}
      <div className="bg-solid-black text-white py-2 border-b-[3px] border-solid-black text-center relative overflow-hidden w-full">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-4">
          <span className="font-bold text-solid-yellow uppercase tracking-widest text-xs md:text-sm">
            <i className="fa-solid fa-clock mr-2"></i>Cierre de Inscripciones en:
          </span>
          <div className="flex gap-3 font-heavy text-xl md:text-2xl text-white">
            <div className="flex flex-col items-center">
              <span>{timeLeft.days}</span>
              <span className="text-[9px] font-sans font-bold text-gray-400">DÍAS</span>
            </div>
            :
            <div className="flex flex-col items-center">
              <span>{timeLeft.hours}</span>
              <span className="text-[9px] font-sans font-bold text-gray-400">HRS</span>
            </div>
            :
            <div className="flex flex-col items-center">
              <span>{timeLeft.minutes}</span>
              <span className="text-[9px] font-sans font-bold text-gray-400">MIN</span>
            </div>
            :
            <div className="flex flex-col items-center">
              <span className="text-solid-pink">{timeLeft.seconds}</span>
              <span className="text-[9px] font-sans font-bold text-gray-400">SEG</span>
            </div>
          </div>
        </div>
      </div>

      {/* ALERTAS (SEGURIDAD Y +18) */}
      <div className="max-w-4xl mx-auto px-4 mt-4 flex flex-col gap-3 w-full">
        {/* Alerta de Seguridad */}
        <div className="bg-red-500 border-[3px] border-solid-black p-2 md:p-3 text-center brutal-shadow">
          <h2 className="font-heavy text-base md:text-lg text-white uppercase tracking-wide mb-1">
            <i className="fa-solid fa-shield-halved mr-2"></i>¡Aviso de Seguridad!
          </h2>
          <p className="font-bold text-white text-[10px] md:text-xs">
            Todos los pagos deben realizarse a nombre de:
          </p>
          <div className="inline-block bg-white text-solid-black font-black text-xs md:text-black px-3 md:px-4 py-1.5 border-2 border-solid-black mt-2">
            MANUEL ROMERO ZELADA
          </div>
        </div>

        {/* Alerta +18 Responsabilidad */}
        <div className="bg-solid-black border-[3px] border-solid-black p-2 md:p-3 text-center brutal-shadow">
          <h2 className="font-heavy text-base md:text-lg text-solid-pink uppercase tracking-wide mb-1">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>Juega de Manera Responsable
          </h2>
          <p className="font-bold text-white text-[10px] md:text-xs">
            La participación en estos sorteos es exclusiva para personas mayores de 18 años.
          </p>
        </div>
        {/* Alerta de Pausa Temporal */}
        <div className="bg-yellow-400 border-[3px] border-solid-black p-3 md:p-4 text-center brutal-shadow mt-2 flex flex-col items-center">
          <h2 className="font-heavy text-base md:text-xl text-solid-black uppercase tracking-wide mb-2">
            <i className="fa-solid fa-clock mr-2"></i>Inscripciones en Revisión
          </h2>
          <p className="font-bold text-solid-black text-xs md:text-sm leading-relaxed mb-3">
            Las inscripciones están temporalmente en revisión. Estamos implementando mejoras de seguridad.
          </p>
          <button
            onClick={onOpenMaintenance}
            className="bg-solid-black text-white font-heavy text-xs md:text-sm py-2 px-4 border-2 border-solid-black brutal-shadow uppercase hover:bg-gray-800 transition"
          >
            Ver Aviso Completo
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-grow max-w-[1200px] mx-auto w-full px-4 py-6 md:py-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-heavy text-3xl sm:text-5xl md:text-6xl text-solid-black uppercase tracking-wider mb-2 leading-tight">
            Sorteos Activos
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-bold text-gray-650 px-2">
            Elige tu premio, asegura tu ticket en nuestra plataforma segura.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* =======================
                 TARJETA 1: JUNIO (CERRADO)
                 ======================= */}
          <div className="bg-solid-yellow border-[3px] border-solid-black rounded-xl p-4 sm:p-5 brutal-shadow flex flex-col relative">
            <div className="bg-red-500 border-2 border-solid-black text-white inline-block px-3 py-1 font-bold text-[10px] sm:text-xs uppercase self-start mb-3 brutal-shadow">
              Sorteo Cerrado (21 de Junio)
            </div>

            <div className="w-full h-48 sm:h-56 border-[3px] border-solid-black rounded-lg overflow-hidden relative bg-white mb-4">
              <img
                src="/premio mayor.webp"
                className="w-full h-full object-cover opacity-60"
                alt="Dinero en Efectivo"
              />
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-solid-black text-white border-2 border-white px-2 py-1 sm:px-3 sm:py-1.5">
                <span className="block text-[10px] sm:text-xs font-bold">1er Premio Mayor</span>
                <span className="font-heavy text-lg sm:text-2xl text-solid-green leading-none">
                  S/ 1,000
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="bg-red-600 text-white font-heavy border-2 border-solid-black px-4 py-2 text-xl brutal-shadow transform -rotate-12 uppercase">
                  Finalizado
                </span>
              </div>
            </div>

            {/* GANADORES - JUNIO */}
            <div className="bg-white border-[3px] border-solid-black rounded-lg p-3 sm:p-4 mb-4 brutal-shadow flex-grow">
              <p className="font-heavy border-b-[3px] border-solid-black pb-2 mb-3 uppercase text-solid-black sm:text-lg flex items-center gap-2">
                <i className="fa-solid fa-trophy text-solid-yellow drop-shadow-md"></i> Ganadores del Sorteo
              </p>

              <div className="flex flex-col gap-2.5">
                {/* 1er Premio */}
                <div className="bg-gray-50 border-[2px] border-solid-black rounded-md p-2 flex items-center gap-3">
                  <div className="text-center w-[72px] flex-shrink-0">
                    <p className="font-heavy text-[10px] uppercase leading-tight">1er Premio</p>
                    <p className="font-heavy text-base text-solid-green">S/ 1,000</p>
                  </div>
                  <div className="border-l-2 border-solid-black pl-3 flex-grow">
                    <p className="font-bold text-sm sm:text-black text-gray-800 leading-tight">David Huerta Tuesta</p>
                    <p className="text-[10px] text-gray-500 font-bold">(Ayacucho)</p>
                  </div>
                </div>

                {/* 2do Premio */}
                <div className="bg-gray-50 border-[2px] border-solid-black rounded-md p-2 flex items-center gap-3">
                  <div className="text-center w-[72px] flex-shrink-0">
                    <p className="font-heavy text-[10px] uppercase leading-tight">2do Premio</p>
                    <p className="font-heavy text-base text-gray-600">S/ 500</p>
                  </div>
                  <div className="border-l-2 border-solid-black pl-3 flex-grow">
                    <p className="font-bold text-sm sm:text-black text-gray-800 leading-tight">Joel Zelada Hernandez</p>
                    <p className="text-[10px] text-gray-500 font-bold">(Ica)</p>
                  </div>
                </div>

                {/* 3er Premio */}
                <div className="bg-gray-50 border-[2px] border-solid-black rounded-md p-2 flex items-start gap-3">
                  <div className="text-center w-[72px] flex-shrink-0 mt-1">
                    <p className="font-heavy text-[10px] uppercase leading-tight">3er Premio</p>
                    <p className="font-heavy text-amber-600 text-amber-700">S/ 200</p>
                  </div>
                  <div className="border-l-2 border-solid-black pl-3 flex-grow">
                    <ul className="text-xs font-bold text-gray-800 flex flex-col gap-1.5">
                      <li className="leading-tight">1. Jesenia Katiuska Tuesta Tapayuri <span className="text-[10px] text-gray-500 font-bold">(Nazca)</span></li>
                      <li className="leading-tight">2. Joel Wilington Jochachi Peryra <span className="text-[10px] text-gray-500 font-bold">(Ica)</span></li>
                      <li className="leading-tight">3. Roger Vidal Romero Becerra <span className="text-[10px] text-gray-500 font-bold">(Cajamarca)</span></li>
                    </ul>
                  </div>
                </div>

                {/* Premios 100 */}
                <div className="bg-gray-50 border-[2px] border-solid-black rounded-md p-2 flex items-start gap-3">
                  <div className="text-center w-[72px] flex-shrink-0 mt-1">
                    <p className="font-heavy text-[9px] uppercase leading-tight">Premios de</p>
                    <p className="font-heavy text-base text-solid-pink">S/ 100</p>
                  </div>
                  <div className="border-l-2 border-solid-black pl-3 flex-grow">
                    <ul className="text-xs font-bold text-gray-800 flex flex-col gap-1.5">
                      <li className="leading-tight">1. Maricielo Aracely Ramos Orellana <span className="text-[10px] text-gray-500 font-bold">(Ica)</span></li>
                      <li className="leading-tight">2. Maria Flor Romero Zelada <span className="text-[10px] text-gray-500 font-bold">(Nazca)</span></li>
                      <li className="leading-tight">3. Daniel Romero Zelada <span className="text-[10px] text-gray-500 font-bold">(Cajamarca)</span></li>
                      <li className="leading-tight">4. David Romero Zelada <span className="text-[10px] text-gray-500 font-bold">(Ica)</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="text-[10px] sm:text-xs font-bold uppercase">Valor del Ticket</p>
                <p className="font-heavy text-3xl sm:text-4xl text-gray-550 line-through">S/ 10.00</p>
              </div>
              <span className="w-full sm:w-auto bg-gray-200 text-gray-500 font-heavy text-center text-sm py-2.5 px-6 border-[3px] border-solid-black cursor-not-allowed select-none brutal-shadow">
                Cerrado
              </span>
            </div>
          </div>

          {/* =======================
                 TARJETA 2: JULIO
                 ======================= */}
          <div className="bg-solid-pink border-[3px] border-solid-black rounded-xl p-4 sm:p-5 brutal-shadow flex flex-col relative mt-4 lg:mt-0">
            <div className="bg-solid-yellow border-2 border-solid-black text-solid-black inline-block px-3 py-1 font-bold text-[10px] sm:text-xs uppercase self-start mb-3 brutal-shadow">
              Sorteo 30 de Agosto
            </div>

            <div className="w-full h-56 sm:h-64 border-[3px] border-solid-black rounded-lg overflow-hidden relative bg-white mb-4">
              <img
                src="/motos_premio.png"
                className="w-full h-full object-cover absolute inset-0 z-0"
                alt="2 Motos Lineales"
              />

              {/* Título Superior */}
              <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/90 via-black/60 to-transparent pt-3 pb-8 px-2 z-10 text-center">
                <span className="block text-[11px] sm:text-xs font-bold text-white uppercase tracking-widest mb-1">Premios Mayores</span>
                <span className="block font-heavy text-xl sm:text-3xl text-solid-yellow uppercase drop-shadow-md leading-none">
                  2 Motos Lineales
                </span>
              </div>

              {/* Recuadros Divididos Inferiores */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 grid grid-cols-2 gap-2 sm:gap-3 z-10">
                <div className="bg-solid-black text-white border-[2px] border-white p-2 text-center brutal-shadow transform -rotate-1 hover:scale-105 transition-transform">
                  <span className="block text-solid-green font-heavy text-xs sm:text-sm uppercase leading-tight">
                    1 Moto Honda Navi Negro
                  </span>
                </div>
                <div className="bg-solid-black text-white border-[2px] border-white p-2 text-center brutal-shadow transform rotate-1 hover:scale-105 transition-transform">
                  <span className="block text-solid-pink font-heavy text-xs sm:text-sm uppercase leading-tight">
                    1 Moto Wanxin WX200GY-8E
                  </span>
                </div>
              </div>
            </div>

            {/* PREMIOS SECUNDARIOS - JULIO */}
            <div className="bg-white border-[3px] border-solid-black rounded-lg p-3 sm:p-4 mb-4 brutal-shadow flex-grow">
              <p className="font-heavy border-b-[3px] border-solid-black pb-2 mb-3 uppercase text-black sm:text-lg flex items-center gap-2">
                <i className="fa-solid fa-gift text-solid-pink"></i> También Sorteamos
              </p>

              <div className="flex flex-col gap-3">
                {/* 20 Premios 50 */}
                <div className="bg-cyan-400 border-[3px] border-solid-black p-3 flex items-center gap-4 brutal-shadow transform hover:-translate-y-1 transition-transform cursor-default">
                  <div className="bg-white border-2 border-solid-black p-3 -rotate-3 flex items-center justify-center brutal-shadow-sm flex-shrink-0">
                    <i className="fa-solid fa-sack-dollar text-3xl text-solid-black"></i>
                  </div>
                  <div className="flex-grow">
                    <div className="inline-block bg-white text-solid-black px-2 py-0.5 font-bold text-[10px] border-2 border-solid-black uppercase tracking-wider mb-1">
                      20 Premios de
                    </div>
                    <div className="font-heavy text-3xl text-solid-black leading-none drop-shadow-sm">
                      S/ 50
                    </div>
                  </div>
                  <div className="hidden sm:block text-right opacity-30">
                    <i className="fa-solid fa-bolt text-3xl text-solid-black"></i>
                  </div>
                </div>

                {/* 5 Premios 100 */}
                <div className="bg-solid-yellow border-[3px] border-solid-black p-3 flex items-center gap-4 brutal-shadow transform hover:-translate-y-1 transition-transform cursor-default">
                  <div className="bg-white border-2 border-solid-black p-3 rotate-3 flex items-center justify-center brutal-shadow-sm flex-shrink-0">
                    <i className="fa-solid fa-money-bill-1-wave text-3xl text-solid-green"></i>
                  </div>
                  <div className="flex-grow">
                    <div className="inline-block bg-solid-black text-white px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider mb-1">
                      5 Premios de
                    </div>
                    <div className="font-heavy text-3xl text-solid-black leading-none drop-shadow-sm">
                      S/ 100
                    </div>
                  </div>
                  <div className="hidden sm:block text-right opacity-20">
                    <i className="fa-solid fa-star text-3xl text-solid-black"></i>
                  </div>
                </div>


              </div>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="text-[10px] sm:text-xs font-bold uppercase">Valor del Ticket</p>
                <p className="font-heavy text-3xl sm:text-4xl">
                  S/ 10.00
                </p>
              </div>
              <button
                type="button"
                disabled={true}
                className="w-full sm:w-auto bg-gray-400 text-gray-700 font-heavy text-lg sm:text-xl px-5 py-2.5 sm:px-6 sm:py-3 uppercase brutal-shadow border-[3px] border-solid-black cursor-not-allowed opacity-80"
              >
                Pausado
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
