"use client";

import { usePathname } from "next/navigation"; //hook nativo
import Footer from "./Footer";

export default function ClientFooterControl() {
    //usePathname da la URL actual (ej: "/" o "/movie/1339713"). si da null, le pongo un string vacío para que no se rompa
  const pathname = usePathname() || "";
  //si la URL arranca con "/movie", significa que estoy en la pantalla de detalle. en ese caso, retorno 'null' para que el footer no se renderice y el detalle ocupe toda la pantalla 
  if (pathname.startsWith("/movie")) return null;

  return <Footer />;
}