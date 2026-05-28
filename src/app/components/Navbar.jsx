"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b border-zinc-900 bg-black sticky top-0 z-40 font-mono">
      <div className="max-w-7xl mx-auto px-4 md:px-16 h-16 flex items-center justify-between">
        <div />

        {/* links simples sin JS */}
        <div className="hidden md:flex items-center gap-6 md:gap-8 text-[10px] tracking-widest uppercase text-zinc-500">
          <a href="#tendencias" className="hover:text-cyan-400 transition-colors">
            Tendencias
          </a>
          <a href="#populares" className="hover:text-cyan-400 transition-colors">
            Populares
          </a>
          <a href="#cartelera" className="hover:text-cyan-400 transition-colors">
            Cartelera
          </a>
          <a href="#estrenos" className="hover:text-cyan-400 transition-colors">
            Estrenos
          </a>
          <a href="#favoritos" className="hover:text-cyan-400 transition-colors">
            Favoritos
          </a>
        </div>

        {/*menu mobile*/}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setOpen((s) => !s)}
            aria-controls="mobile-menu"
            aria-expanded={open}
            className="p-2 rounded-md text-zinc-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <span className="sr-only">Abrir menú</span>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden bg-black border-t border-zinc-900 overflow-hidden transition-max-h duration-300 ease-in-out ${
          open ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4 pt-3 space-y-1 flex flex-col">
          <a className="block text-sm text-zinc-400 hover:text-cyan-400 transition-colors" href="#tendencias">
            Tendencias
          </a>
          <a className="block text-sm text-zinc-400 hover:text-cyan-400 transition-colors" href="#populares">
            Populares
          </a>
          <a className="block text-sm text-zinc-400 hover:text-cyan-400 transition-colors" href="#cartelera">
            Cartelera
          </a>
          <a className="block text-sm text-zinc-400 hover:text-cyan-400 transition-colors" href="#estrenos">
            Estrenos
          </a>
          <a className="block text-sm text-zinc-400 hover:text-cyan-400 transition-colors" href="#favoritos">
            Favoritos
          </a>
        </div>
      </div>
    </nav>
  );
}