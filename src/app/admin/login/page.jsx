"use client";

import { useState } from "react";
import { auth, googleProvider, db } from "@/config/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Verificar si el correo es administrador
      const adminDoc = await getDoc(doc(db, "admins", user.email));

      if (adminDoc.exists() && adminDoc.data().active === true) {
        // Redirigir al dashboard
        router.push("/admin/dashboard");
      } else {
        // No autorizado
        await auth.signOut();
        setError("No tienes permisos para acceder al panel administrativo.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Ocurrió un error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-solid-black relative overflow-hidden">
      {/* Fondo decorativo discreto */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-solid-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full p-8 sm:p-10 text-center relative z-10">
        
        {/* Logo de la empresa */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-solid-yellow shadow-md overflow-hidden bg-white">
            <img 
              src="/logo_premios_Romero.webp" 
              alt="Logo Premios Romero" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="font-heavy text-2xl sm:text-3xl text-gray-800 mb-2">
          Panel Administrativo
        </h1>
        <p className="text-gray-500 font-bold text-sm mb-8">
          Acceso exclusivo para personal autorizado
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg font-bold mb-6 text-sm flex items-center text-left">
            <i className="fa-solid fa-triangle-exclamation text-xl mr-3"></i>
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg font-bold text-lg py-3 flex items-center justify-center transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin text-gray-500"></i>
          ) : (
            <>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Continuar con Google
            </>
          )}
        </button>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 flex items-center justify-center gap-2">
            <i className="fa-solid fa-shield-halved"></i>
            Tu acceso será validado con permisos de administrador.
          </p>
        </div>
      </div>
    </div>
  );
}
