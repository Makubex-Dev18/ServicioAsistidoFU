import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAFU",
  description: "Servicio asistido farmacia universal",
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="es">
      <body className={inter.className}>
        {/* Estructura principal */}
        <div className="min-h-screen bg-gray-100">
          {/* Header/Navbar superior */}
          <Header/>

          <div className="flex">
            {/* Sidebar lateral (menú) */}


            {/* Contenido principal */}
            <main className="flex-1 p-6">
              {children} {/* Aquí se renderizan tus páginas */}
            </main>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
