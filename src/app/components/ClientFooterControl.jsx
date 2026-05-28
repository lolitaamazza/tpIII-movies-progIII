"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ClientFooterControl() {
  const pathname = usePathname() || "";

  //oculta el footer en cualquier ruta que comience con /movie
  if (pathname.startsWith("/movie")) return null;

  return <Footer />;
}