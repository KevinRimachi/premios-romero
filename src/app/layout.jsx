import { Inter, Anton } from "next/font/google";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heavy",
});

export const metadata = {
  metadataBase: new URL('https://www.premiosromeroperu.com'),
  title: "Premios Romero Perú | Sorteos, premios y promociones",
  description: "Participa en las campañas de Premios Romero Perú, conoce los premios disponibles y mantente informado sobre nuestras promociones y novedades.",
  keywords: ["premios romero peru", "premios romero", "sorteos peru", "promociones peru", "campañas romero"],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Premios Romero Perú",
    description: "Participa en nuestras campañas, premios y promociones.",
    url: "https://www.premiosromeroperu.com/",
    siteName: "Premios Romero Perú",
    type: "website",
    locale: "es_PE",
  },
  twitter: {
    card: "summary",
    title: "Premios Romero Perú",
    description: "Participa en nuestras campañas, premios y promociones.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-PE" className={`${inter.variable} ${anton.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col relative">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
