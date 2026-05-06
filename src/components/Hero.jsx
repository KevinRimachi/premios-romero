"use client";

import { useState, useEffect } from "react";

export default function Hero({ onOpenForm, onOpenInactive }) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    // May 30, 2026 20:00:00
    const countDownDate = new Date("Jun 20, 2026 24:00:00").getTime();

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
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-grow max-w-[1200px] mx-auto w-full px-4 py-6 md:py-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-heavy text-3xl sm:text-5xl md:text-6xl text-solid-black uppercase tracking-wider mb-2 leading-tight">
            Sorteos Activos
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-bold text-gray-600 px-2">
            Elige tu premio, asegura tu ticket en nuestra plataforma segura.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* =======================
                 TARJETA 1: ABRIL
                 ======================= */}
          <div className="bg-solid-yellow border-[3px] border-solid-black rounded-xl p-4 sm:p-5 brutal-shadow flex flex-col relative">
            <div className="bg-white border-2 border-solid-black inline-block px-3 py-1 font-bold text-[10px] sm:text-xs uppercase self-start mb-3 brutal-shadow">
              Sorteo 21 de Junio
            </div>

            <div className="w-full h-48 sm:h-56 border-[3px] border-solid-black rounded-lg overflow-hidden relative bg-white mb-4">
              <img
                src="/premio mayor.webp"
                className="w-full h-full object-cover"
                alt="Dinero en Efectivo"
              />
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-solid-black text-white border-2 border-white px-2 py-1 sm:px-3 sm:py-1.5">
                <span className="block text-[10px] sm:text-xs font-bold">1er Premio Mayor</span>
                <span className="font-heavy text-lg sm:text-2xl text-solid-green leading-none">
                  S/ 2,000
                </span>
              </div>
            </div>

            {/* PREMIOS SECUNDARIOS (DINERO) */}
            <div className="bg-white border-[3px] border-solid-black rounded-lg p-3 sm:p-4 mb-4 brutal-shadow flex-grow">
              <p className="font-heavy border-b-[3px] border-solid-black pb-2 mb-3 uppercase text-black sm:text-lg flex items-center gap-2">
                <i className="fa-solid fa-money-bill-wave text-solid-green"></i> También Sorteamos
              </p>
              <div className="flex flex-col gap-2.5">
                {/* 2do Puesto */}
                <div className="bg-green-50 border-[2px] border-solid-black rounded-md p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1580519542036-ed47f3e42bb4?auto=format&fit=crop&w=100&q=80"
                      className="w-10 h-10 object-cover border-2 border-solid-black rounded-full"
                      alt="Efectivo"
                    />
                    <div>
                      <span className="bg-solid-black text-white font-heavy text-[9px] sm:text-[10px] px-2 py-0.5 uppercase tracking-wide">
                        2do Puesto
                      </span>
                      <p className="font-heavy text-xl sm:text-2xl text-solid-green leading-none mt-1 drop-shadow-[1px_1px_0_#000]">
                        S/ 1,000
                      </p>
                    </div>
                  </div>
                  <i className="fa-solid fa-sack-dollar text-2xl sm:text-3xl text-solid-yellow drop-shadow-[1px_1px_0_#000] mr-2"></i>
                </div>

                {/* 3er al 6to Puesto */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-100 border-[2px] border-solid-black rounded p-2 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase leading-none mb-1">
                        3er Puesto x 2 premios
                      </p>
                      <div className="flex gap-2">
                        <p className="font-heavy text-black leading-none">S/ 500</p>
                        <p className="font-heavy text-black leading-none">S/ 500</p>
                      </div>

                    </div>
                    <i className="fa-solid fa-money-bill-wave text-solid-green text-lg"></i>
                  </div>
                  <div className="bg-gray-100 border-[2px] border-solid-black rounded p-2 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase leading-none mb-1">
                        4to Puesto x 3 premios
                      </p>
                      <div className="flex gap-2">
                        <p className="font-heavy text-black leading-none">S/ 200</p>
                        <p className="font-heavy text-black leading-none">S/ 200</p>
                        <p className="font-heavy text-black leading-none">S/ 200</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-money-bill-1-wave text-solid-green text-lg"></i>
                  </div>
                  <div className="bg-gray-100 border-[2px] border-solid-black rounded p-2 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase leading-none mb-1">
                        5to Puesto x 4 premios
                      </p>
                      <div className="flex gap-2">
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-coins text-solid-yellow text-lg"></i>
                  </div>

                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="text-[10px] sm:text-xs font-bold uppercase">Valor del Ticket</p>
                <p className="font-heavy text-3xl sm:text-4xl">S/ 10.00</p>
              </div>
              <button
                onClick={() => onOpenForm({ name: "Junio", price: 10, prize: "S/ 2,000" })}
                className="w-full sm:w-auto bg-solid-black text-white font-heavy text-lg sm:text-xl px-5 py-2.5 sm:px-6 sm:py-3 uppercase brutal-shadow hover:bg-gray-800 border-[3px] border-solid-black cursor-pointer"
              >
                Comprar
              </button>
            </div>
          </div>

          {/* =======================
                 TARJETA 2: MAYO
                 ======================= */}
          <div className="bg-solid-pink border-[3px] border-solid-black rounded-xl p-4 sm:p-5 brutal-shadow flex flex-col relative mt-4 lg:mt-0">
            <div className="bg-white border-2 border-solid-black inline-block px-3 py-1 font-bold text-[10px] sm:text-xs uppercase self-start mb-3 brutal-shadow">
              Sorteo 31 de Julio
            </div>

            <div className="w-full h-48 sm:h-56 border-[3px] border-solid-black rounded-lg overflow-hidden relative bg-white mb-4">
              <img
                src="/premio mayor.webp"
                className="w-full h-full object-cover"
                alt="Efectivo y Monedas"
              />
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-solid-black text-white border-2 border-white px-2 py-1 sm:px-3 sm:py-1.5">
                <span className="block text-[10px] sm:text-xs font-bold">1er Premio Mayor</span>
                <span className="font-heavy text-lg sm:text-2xl text-solid-green leading-none">
                  S/ 2 motos lineales
                </span>
              </div>
            </div>

            {/* PREMIOS SECUNDARIOS (DINERO) */}
            <div className="bg-white border-[3px] border-solid-black rounded-lg p-3 sm:p-4 mb-4 brutal-shadow flex-grow">
              <p className="font-heavy border-b-[3px] border-solid-black pb-2 mb-3 uppercase text-black sm:text-lg flex items-center gap-2">
                <i className="fa-solid fa-money-bill-wave text-solid-green"></i> También Sorteamos
              </p>
              <div className="flex flex-col gap-2.5">
                {/* 2do Puesto */}
                <div className="bg-green-50 border-[2px] border-solid-black rounded-md p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1580519542036-ed47f3e42bb4?auto=format&fit=crop&w=100&q=80"
                      className="w-10 h-10 object-cover border-2 border-solid-black rounded-full"
                      alt="Efectivo"
                    />
                    <div>
                      <span className="bg-solid-black text-white font-heavy text-[9px] sm:text-[10px] px-2 py-0.5 uppercase tracking-wide">
                        2do Puesto x 5 premios
                      </span>
                      <div className="flex gap-2">
                        <p className="font-heavy text-black leading-none">S/ 200</p>
                        <p className="font-heavy text-black leading-none">S/ 200</p>
                        <p className="font-heavy text-black leading-none">S/ 200</p>
                        <p className="font-heavy text-black leading-none">S/ 200</p>
                        <p className="font-heavy text-black leading-none">S/ 200</p>
                      </div>
                    </div>
                  </div>
                  <i className="fa-solid fa-sack-dollar text-2xl sm:text-3xl text-solid-yellow drop-shadow-[1px_1px_0_#000] mr-2"></i>
                </div>

                {/* 3er al 6to Puesto */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-100 border-[2px] border-solid-black rounded p-2 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase leading-none mb-1">
                        3er Puesto x 10 premios
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                        <p className="font-heavy text-black leading-none">S/ 100</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-money-bill-wave text-solid-green text-lg"></i>
                  </div>

                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="text-[10px] sm:text-xs font-bold uppercase">Valor del Ticket</p>
                <p className="font-heavy text-3xl sm:text-4xl">
                  S/ 00.00
                </p>
              </div>
              <button
                onClick={onOpenInactive}
                className="w-full sm:w-auto bg-gray-200 text-gray-500 font-heavy text-lg sm:text-xl px-5 py-2.5 sm:px-6 sm:py-3 uppercase brutal-shadow hover:bg-gray-300 border-[3px] border-solid-black cursor-not-allowed"
              >
                Próximamente
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
