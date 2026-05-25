import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "BioYoga Consciente - Cursos y Formaciones de Yoga",
  description: "Plataforma de formación profesional y cursos en yoga, meditación y bienestar consciente.",
  icons: {
    icon: "/logo-sin-fondo.png",
    apple: "/logo-sin-fondo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
