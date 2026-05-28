import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-zinc-600 font-mono text-[11px] uppercase tracking-widest border-t border-zinc-950 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex flex-col sm:flex-row gap-6 justify-between items-center">
        
        <div className="space-y-1 text-center sm:text-left">
          <p>© {currentYear} // CINEAPP. LOLA MAZZA OLIVER. ALL RIGHTS RESERVED.</p>
          <p className="text-zinc-700 text-[10px]">
            PROGRAMACIÓN III — TECNOLOGÍA MULTIMEDIAL (UMAI)
          </p>
        </div>

        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-cyan-400 transition-colors duration-300">
            [ INICIO ]
          </Link>
          <a 
            href="https://www.themoviedb.org/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-cyan-400 transition-colors duration-300 text-zinc-500"
          >
            DATA BY TMDB
          </a>
        </div>

      </div>
    </footer>
  );
}