"use client";

import { useEffect, useState } from "react";
import { tmdbApi, tmdbEndpoints, TMDB_API_KEY } from "./utils/tmdb"; 
import MovieSection from "./components/MovieSection";
import MovieCard from "./components/MovieCard";
import FavoritesSection from "./components/FavoritesSection";

export default function HomePage() {
  const [featuredMovie, setFeaturedMovie] = useState(null); //almacena la película que se usa de fondo en el hero
  const [loading, setLoading] = useState(true); //estado de carga
  const [error, setError] = useState(null); //estado de error

  //estados para el buscador interactivo
  const [searchQuery, setSearchQuery] = useState(""); //guarda el string que el usuario escribe en el input
  const [searchResults, setSearchResults] = useState([]); //almacena el array de resultados devuelto por la búsqueda
  const [searching, setSearching] = useState(false);  //feedback visual que indica si se está consultando a la API en ese instante

  //trae las películas en tendencia para elegir la primera como destacada en el hero
  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        setLoading(true);
        const response = await tmdbApi.get(tmdbEndpoints.trendingMovies);
        if (response.data.results.length > 0) {
          //tomo únicamente el primer resultado indexado [0] para setear el banner principal
          setFeaturedMovie(response.data.results[0]);
        }
      } catch (err) {
        console.error("Error al traer la película destacada:", err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroMovie();
  }, []); //array de dependencias vacío = solo se ejecuta una vez al montar la aplicación

  //efecto de busqueda en tiempo real (con debounce de 400ms)
  useEffect(() => {
    //si el buscador está vacío, limpiamos los resultados anteriores y abortamos la ejecución
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    //creo un temporizador que retrasa la petición a la API por 400ms. si el usuario presiona otra tecla antes de que pasen los 400ms, este efecto se destruye y el reloj vuelve a arrancar de cero.
    const delayDebounceFn = setTimeout(async () => {
      try {
        setSearching(true);
        //uso encodeURIComponent para limpiar espacios o caracteres raros de la query y mandarla segura en la URL
        const response = await tmdbApi.get(
          `/search/movie?query=${encodeURIComponent(searchQuery)}&api_key=${TMDB_API_KEY}`
        );
        setSearchResults(response.data.results);
      } catch (err) {
        console.error("Error ejecutando la búsqueda:", err);
      } finally {
        setSearching(false);
      }
    }, 400); 

    //borra el timer anterior cada vez que el usuario sigue escribiendo. evita disparar 10 peticiones simultáneas si alguien escribe rápido una palabra de 10 letras.
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]); //el efecto se reactiva instantáneamente cada vez que muta 'searchQuery'

  if (loading) { //control de carga global
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white font-mono">
        <p className="text-sm uppercase tracking-widest text-cyan-400 animate-pulse">
          // Loading cinema data...
        </p>
      </div>
    );
  }

  if (error) { //control de errores
    return (
      <div className="flex justify-center items-center h-screen bg-black text-red-500 font-mono">
        <p className="text-sm uppercase tracking-widest">[ Error: {error} ]</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden antialiased">
      
      {/*barra de usqueda fixed arriba*/}
      <div className="pt-8 pb-4 px-6 md:px-16 max-w-7xl mx-auto relative z-20">
        <div className="relative border-b border-zinc-800 focus-within:border-cyan-500 transition-colors duration-300">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-600 uppercase tracking-widest">
            [ BUSCAR ] 
          </span>
          <input 
            type="text"
            placeholder=" INGRESA EL TÍTULO DE LA PELÍCULA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} //al cambiar el texto gatilla la cascada del useEffect con debounce
            className="w-full bg-transparent pl-20 pr-4 py-4 text-sm font-mono tracking-wider text-white uppercase placeholder-zinc-700 focus:outline-none"
          /> 
          {/*botón de reset que aparece condicionalmente solo si el input tiene texto adentro*/}
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} //al vaciar el string el catálogo normal se vuelve a montar solo
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 hover:text-red-400 transition-colors"
            >
              CLEAR ×
            </button>
          )}
        </div>
      </div>

     {/*contenido dinamico*/}
      {searchQuery !== "" ? (
        //SI ESTÁ BUSCANDO: muestro la grilla de resultados
        <div className="py-8 px-6 md:px-16 max-w-7xl mx-auto space-y-20">
          <section>
            <div className="mb-8">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                // Resultados para: <span className="text-cyan-400">"{searchQuery}"</span>
              </h2>
            </div>

            {searching ? (
              <p className="text-xs font-mono text-zinc-600 animate-pulse">// Buscando en los archivos...</p>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchResults.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              //mensaje de no resultados
              <p className="text-xs font-mono text-zinc-600">[ No se encontraron coincidencias para la búsqueda ]</p>
            )}
          </section>
        </div>
      ) : (
        //SI NO BUSCA: catálogo regular con hero + sliders + favoritos
        <>
          {/*hero destacado*/}
          {featuredMovie && (
            <section className="relative w-screen h-[60vh] flex items-end justify-start overflow-hidden border-b border-zinc-900/50">
              <div className="absolute inset-0 z-0">
                <img 
                  src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`} 
                  alt={featuredMovie.title}
                  className="w-full h-full object-cover object-top opacity-80 scale-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/10 to-transparent" />
              </div>

              <div className="relative z-10 max-w-5xl px-6 md:px-16 pb-12 space-y-3">
                <span className="inline-block text-[10px] font-mono tracking-widest uppercase text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded bg-cyan-950/10 backdrop-blur-sm">
                  Destacada de Hoy
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none max-w-4xl wrap-break-word">
                  {featuredMovie.title}
                </h1>
                <p className="text-zinc-400 text-xs md:text-sm max-w-2xl line-clamp-2 font-light leading-relaxed">
                  {featuredMovie.overview}
                </p>
              </div>
            </section>
          )}

          {/*SLIDERS REQUERIDOS + GRILLA DE FAVORITOS AL FINAL*/}
         
    {/*SLIDERS REQUERIDOS*/}
          <div className="py-12 pl-6 md:pl-16 space-y-20">
            
            <div id="tendencias">
              <MovieSection title="Películas en Tendencia" endpoint={tmdbEndpoints.trendingMovies} />
            </div>

            <div id="populares">
              <MovieSection title="Películas Populares" endpoint={tmdbEndpoints.popularMovies} />
              </div>

            <div>
              <MovieSection title="Mejor Puntuadas" endpoint={tmdbEndpoints.topRatedMovies} />
            </div>

            <div id="cartelera">
              <MovieSection title="En Cartelera" endpoint={tmdbEndpoints.nowPlayingMovies} />
            </div>

            <div id="estrenos">
              <MovieSection title="Próximos Estrenos" endpoint={tmdbEndpoints.upcomingMovies} />
            </div>

          </div>

          <div id="favoritos" className="pb-24 pl-6 md:pl-16">
            <FavoritesSection />
          </div>
        </>
      )}

    </main>
  );
}