export default function Footer({ onOpenAdmin }) {
  return (
    <footer className="bg-solid-black text-gray-500 py-6 text-center border-t-4 border-white relative mt-auto">
      <p className="font-bold text-sm">© 2026 Premios Lorenzo. Sistema de Sorteos Seguro.</p>
      <button
        onClick={onOpenAdmin}
        className="absolute bottom-4 right-4 text-gray-700 hover:text-white transition"
      >
        <i className="fa-solid fa-lock text-sm"></i>
      </button>
    </footer>
  );
}
