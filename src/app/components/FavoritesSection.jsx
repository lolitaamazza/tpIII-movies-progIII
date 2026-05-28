"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

export default function FavoritesSection() {
  const [favorites, setFavorites] = useState([]); //estado para almacenar el array de objetos de las películas favoritas

  const loadFavorites = () => { //función para cargar los favoritos desde localStorage
    if (typeof window !== "undefined") { //verificación de seguridad q se asegura de que el código corra en el cliente y no en el servidor
        //traigo el string de 'localStorage'. como se guarda en texto plano, lo convierto a objeto. si no hay nada guardado aún, le clavo un array vacío '[]' por defecto para que no rompa
      const saved = JSON.parse(localStorage.getItem("cineapp_favorites")) || [];
      setFavorites(saved); //actualizo el estado con los favoritos cargados
    }
  };

  useEffect(() => {
    loadFavorites(); //cargar favoritos al iniciar
    //evento global personalizado ('favorites_updated') que disparo desde MovieCard. cada vez que el usuario sume o saque un corazón en cualquier lado, este evento se va a activar y ejecutará 'loadFavorites'.
    window.addEventListener("favorites_updated", loadFavorites);
    return () => window.removeEventListener("favorites_updated", loadFavorites); //limpieza del event listener para evitar fugas de memoria si el componente se desmonta
  }, []);

  return (
    <section>
      <div className="flex items-baseline justify-between mb-6 pr-6 md:pr-16">
        <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
          Mis Películas Favoritas
        </h2>
        <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
            {/*muestra la cantidad de elementos en tiempo real usando el .length del array de estados*/}
          <span>{favorites.length} GUARDADAS</span>
          {/*el indicador 'Deslizar →' solo aparece si efectivamente hay películas para scrollear*/}
          {favorites.length > 0 && <span>Deslizar →</span>}
        </div>
      </div>

{/* RENDERIZADO CONDICIONAL: el usuario guardó películas?*/}
      {favorites.length > 0 ? (
        /* CASO 1: SI HAY FAVORITOS -> renderiza el slider horizontal idéntico a las secciones de la API */
        <div className="flex gap-6 overflow-x-auto overflow-y-hidden pr-6 md:pr-16 scrollbar-hide pb-4 snap-x snap-mandatory">
          {favorites.map((movie) => (
            <div key={movie.id} className="w-50 md:w-60 shrink-0 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        /* CASO 2: SI ESTÁ VACÍO -> muestra un cartel*/
        <div className="py-12 border border-dashed border-zinc-900 rounded-xl flex items-center justify-center mr-6 md:mr-16">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest text-center px-4">
            [ Tu lista de favoritos está vacía. Presioná el corazón en cualquier póster ]
          </p>
        </div>
      )}
    </section>
  );
}