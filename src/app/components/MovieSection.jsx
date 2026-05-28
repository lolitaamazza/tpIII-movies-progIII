"use client"; 

import { useEffect, useState } from "react";
import { tmdbApi } from "../utils/tmdb";
import MovieCard from "./MovieCard";

//recibe por props el 'title' (ej: "películas populares") y el 'endpoint' específico que debe consultar de la API
export default function MovieSection({ title, endpoint }) {
  const [movies, setMovies] = useState([]); //almacena el listado de películas devuelto por TMDB
  const [loading, setLoading] = useState(true); //controla si la sección está cargando o ya tiene los datos

  useEffect(() => { //se ejecuta al montar el componente y cada vez que cambia el endpoint
    const fetchSectionMovies = async () => {
      try {
        setLoading(true); //indica que se está cargando la sección
        const response = await tmdbApi.get(endpoint); //realiza la consulta a la API mediante axios y el endpoint proporcionado
        setMovies(response.data.results); //almacena el listado de películas en el estado
      } catch (err) {
        console.error(`Error al cargar la sección ${title}:`, err); //captura y muestra en consola fallas de red o de la API
      } finally {
        setLoading(false); //indica que terminó la carga, ya sea con éxito o con error para que el componente deje de mostrar el mensaje de "cargando" y renderice el contenido o el mensaje de error correspondiente
      }
    };

    fetchSectionMovies();
  }, [endpoint]); //si el endpoint cambia por alguna razón, se vuelve a ejecutar para obtener los nuevos datos

  //mientras carga una sección en específico mostramos un msj
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-48 bg-zinc-900 animate-pulse rounded"></div>
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="w-50 md:w-60 aspect-2/3 bg-zinc-950 rounded-lg animate-pulse shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  //si por algún motivo la API no trae películas para esta sección, no mostramos nada
  if (movies.length === 0) return null;

  return (
    <section>
      {/*encabezado de la sección: título + hint de deslizar */}
      <div className="flex items-baseline justify-between mb-6 pr-6 md:pr-16">
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
          {title}
        </h2>
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
          Deslizar →
        </span>
      </div>

      {/* contenedor del slider horizontal */}
      <div
        className="flex gap-6 overflow-x-auto overflow-y-hidden pr-6 md:pr-16 scrollbar-hide pb-4 snap-x snap-mandatory"
        style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }} //permite que gestos verticales suban/bajen la página
      >
        {/*recorre el array de películas en el estado y renderiza un componente MovieCard para cada uno */}
        {movies.map((movie) => (
          <div key={movie.id} className="w-50 md:w-60 shrink-0 snap-start">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}