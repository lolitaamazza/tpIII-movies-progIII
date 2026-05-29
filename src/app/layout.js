import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import ClientFooterControl from "./components/ClientFooterControl";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CineApp - TMDB",
  description: "Catálogo interactivo de películas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="bg-black scroll-smooth scrollbar-hide">
      <body className={`${inter.className} min-h-screen flex flex-col bg-black text-white antialiased scrollbar-hide`}>
        <Navbar />

        <div className="grow">
          {children}
        </div>

        {/*footer mostrado condicionalmente desde un componente cliente*/}
        <ClientFooterControl />
        
      </body>
    </html>
  );
}