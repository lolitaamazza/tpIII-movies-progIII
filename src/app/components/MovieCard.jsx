import { useEffect, useState } from "react";
import Link from "next/link";
import { getTmdbImageUrl } from "../utils/tmdb";

export default function MovieCard({ movie }) {
  const posterUrl = getTmdbImageUrl(movie.poster_path); //obtiene la URL de la imagen del póster
  const [isFavorite, setIsFavorite] = useState(false); //estado para manejar si la película es favorita

  //compruebo si esta película ya estaba guardada en favoritos al cargar la tarjeta
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("cineapp_favorites")) || [];
    const exists = savedFavorites.some((fav) => fav.id === movie.id); //.some() recorre el array y devuelve true si encuentra al menos un elemento que coincida con el ID de esta tarjeta
    setIsFavorite(exists); //actualiza el estado de isFavorite
  }, [movie.id]); //dependencia para que se ejecute cuando cambie el ID de la película

  //función para agregar o remover del localStorage
  const toggleFavorite = (e) => {
    e.preventDefault(); //evita que al hacer clic en el corazón se abra la página de detalle
    e.stopPropagation(); //detiene la propagación del evento para que no afecte a otros elementos

    const savedFavorites = JSON.parse(localStorage.getItem("cineapp_favorites")) || []; //obtiene la lista de favoritos del localStorage y la parsea como un array
    let updatedFavorites; //variable para almacenar la lista actualizada de favoritos

    if (isFavorite) {
      //si ya era favorito lo filtro para armar un array nuevo EXCLUYENDO esta película
      updatedFavorites = savedFavorites.filter((fav) => fav.id !== movie.id);
    } else {
      //si no era clono el array existente con Spread Syntax (...) y le inyecto el nuevo objeto al final
      updatedFavorites = [...savedFavorites, movie];
    }

    localStorage.setItem("cineapp_favorites", JSON.stringify(updatedFavorites)); //impacto el cambio en el localstorage transformando el objeto JS de nuevo a un string plano
    setIsFavorite(!isFavorite); //invierto el estado de la iu local para pintar o despintar el corazón al instante

    //dispara un evento global para avisarle a la sección de favoritos que se actualice en tiempo real
    window.dispatchEvent(new Event("favorites_updated"));
  };

  return (
    //coloco la clase 'group' en el contenedor padre para que los elementos hijos puedan reaccionar de forma coordinada
    <div className="group block w-full relative">
      
      {/* BOTÓN CORAZÓN*/}
      <button
        onClick={toggleFavorite}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        className={`absolute top-2 left-2 z-20 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/5 transition-transform transform-gpu focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
          isFavorite ? "scale-105 shadow-[0_6px_20px_rgba(220,38,38,0.12)]" : "hover:scale-110"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          className={`transition-all duration-300 ${
            isFavorite ? "text-red-500 fill-current" : "text-zinc-400 group-hover:text-zinc-200"
          }`}
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M12.1 21.35l-1.1-1.01C5.14 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41.81 4.6 2.09C12.09 4.81 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.14 6.86-8.9 11.84l-1 1.01z"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ENLACE GENERAL AL DETALLE */}
      <Link href={`/movie/${movie.id}`} className="focus:outline-none block">
        {/*contenedor del poster */}
        <div className="relative w-full aspect-2/3 bg-zinc-950 rounded-lg overflow-hidden transition-all duration-500 ease-out group-hover:scale-[1.02]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-700 ease-out"
              loading="lazy"
            />
          ) : (
            /*fallback visual de consola rígida si la API no reporta una imagen válida */
            <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs font-mono uppercase border border-zinc-900 p-4 text-center">
              [ No Image ]
            </div>
          )}
          
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
{/*puntaje */}
          {movie.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-yellow-400 px-1.5 py-0.5 rounded border border-white/5">
              ★ {movie.vote_average.toFixed(1)}
            </div>
          )}
        </div>

        <div className="mt-3 space-y-0.5">
          <h3 className="font-bold text-sm text-zinc-200 tracking-tight line-clamp-1 group-hover:text-cyan-400 transition-colors duration-300 uppercase">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>{movie.release_date ? movie.release_date.split("-")[0] : "----"}</span>
            <span className="opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity duration-300 tracking-widest text-[9px]">
              VER →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}