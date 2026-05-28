"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { tmdbApi, tmdbEndpoints, getTmdbImageUrl, TMDB_API_KEY } from "../../utils/tmdb";
import MovieCard from "../../components/MovieCard";

export default function MovieDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params; 

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]); //estado para almacenar los actores
  const [recommendations, setRecommendations] = useState([]); //recomendaciones
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  //forzar scroll al inicio cuando cambia la película (id)
  useEffect(() => {
    if (typeof window !== "undefined") {
      //pequeña demora para asegurar el render inicial antes de hacer scroll
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
    }
  }, [id]);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        
        //consultas en paralelo a la API de TMDB (detalle, créditos y recomendaciones)
        const [detailResponse, creditsResponse, recsResponse] = await Promise.all([
          tmdbApi.get(`/movie/${id}?api_key=${TMDB_API_KEY}`),
          tmdbApi.get(`/movie/${id}/credits?api_key=${TMDB_API_KEY}`),
          tmdbApi.get(`/movie/${id}/recommendations?api_key=${TMDB_API_KEY}`)
        ]);

        setMovie(detailResponse.data);
        setCast(creditsResponse.data.cast.slice(0, 10));
        //limitar número de recomendaciones para el slider
        setRecommendations((recsResponse.data.results || []).slice(0, 10));

      } catch (err) {
        console.error("Error al cargar los datos de la película:", err);
        setError("No se pudo cargar la información de la película.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white font-mono">
        <p className="text-xs uppercase tracking-widest text-cyan-400 animate-pulse">
          // Querying database for movie ID: {id}...
        </p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen bg-black text-red-500 font-mono">
        <p className="text-xs uppercase tracking-widest">[ {error || "Película no encontrada"} ]</p>
        <Link href="/" className="text-xs text-zinc-400 hover:text-white border border-zinc-800 px-4 py-2 rounded">
          ← VOLVER AL INICIO
        </Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;
  const posterUrl = getTmdbImageUrl(movie.poster_path);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black relative overflow-x-hidden antialiased">
      
     

      {/*botón para volver */}
      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-zinc-500 hover:text-cyan-400 tracking-widest transition-colors duration-300"
        >
          <span>←</span> volver al catálogo
        </Link>
      </div>

      {/*seccion superior-> detalle peli*/}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/*poster */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-70 md:w-85 aspect-2/3 bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-zinc-900">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs font-mono uppercase">[ No Poster ]</div>
            )}
          </div>
        </div>

        {/*metadata y descripción*/}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          
          {/*bloque de rating*/}
          <div className="flex items-center gap-6 bg-zinc-950/40 backdrop-blur-sm border border-zinc-900 p-4 rounded-xl w-fit font-mono">
            <div className="flex items-baseline text-4xl md:text-5xl font-black text-yellow-400 tracking-tighter">
              <span className="text-2xl md:text-3xl mr-1">★</span>
              {movie.vote_average?.toFixed(1)}
              <span className="text-xs text-zinc-600 font-normal ml-1">/10</span>
            </div>
            
            <div className="space-y-0.5 border-l border-zinc-800 pl-4">
              <span className="text-[10px] text-zinc-500 tracking-widest uppercase block">Evaluación</span>
              <span className="text-xs text-zinc-300 font-bold block tracking-tight">
                {movie.vote_count?.toLocaleString()} USUARIOS CALIFICARON
              </span>
            </div>
          </div>

          {/*detalles mas pequeños*/}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
            <span>{movie.runtime ? `${movie.runtime} MIN` : "N/A"}</span>
            <span className="text-zinc-800">|</span>
            <span className="uppercase text-cyan-400">{movie.status}</span>
            <span className="text-zinc-800">|</span>
            <span>{movie.release_date ? movie.release_date.split("-")[0] : "----"}</span>
          </div>

          {/*titulo*/}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-sm md:text-base font-mono text-cyan-500/80 italic tracking-tight">
                // {movie.tagline}
              </p>
            )}
          </div>

          {/*sinopsis*/}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Sinopsis</h3>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-light max-w-3xl">
              {movie.overview || "No hay una sinopsis disponible para esta película."}
            </p>
          </div>

          {/*genero*/}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-900 font-mono text-xs">
            <div className="space-y-1.5">
              <span className="text-zinc-600 uppercase tracking-wider block">Géneros</span>
              <div className="flex flex-wrap gap-1 text-zinc-300 uppercase text-[11px] leading-relaxed">
                {movie.genres?.map(g => g.name).join(", ") || "N/A"}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-zinc-600 uppercase tracking-wider block">Idioma Original</span>
              <span className="text-zinc-300 uppercase tracking-widest text-[11px]">
                [{movie.original_language}]
              </span>
            </div>
          </div>

        </div>
      </div>

      {/*cast*/}
      <div className="relative z-10 pt-8 pb-24 pl-6 md:pl-16">
        <div className="max-w-7xl mb-8 pr-6 md:pr-16 flex items-baseline justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span>
            Reparto Principal
          </h2>
          <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-wider">
            Deslizar →
          </span>
        </div>

        {cast.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto overflow-y-hidden pr-6 md:pr-16 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            {cast.map((actor) => (
              <div key={actor.id} className="w-32.5 md:w-37.5 shrink-0 group">
                {/* contenedor de la foto */}
                <div className="w-full aspect-3/4 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-950 group-hover:border-zinc-800 transition-colors duration-300">
                  {actor.profile_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`} 
                      alt={actor.name} 
                      className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-zinc-700 text-center uppercase p-2">
                      [ No Photo ]
                    </div>
                  )}
                </div>
                
                {/*nombres del actor y personaje*/}
                <div className="mt-3 font-mono space-y-0.5">
                  <p className="text-[11px] font-bold text-zinc-300 truncate uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
                    {actor.name}
                  </p>
                  <p className="text-[9px] text-zinc-600 truncate uppercase tracking-widest">
                    {actor.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            [ Información del reparto no disponible ]
          </p>
        )}
      </div>

      {/*recos: If you liked "title" you might also like... */}
      <div className="relative z-10 pb-32 pl-6 md:pl-16">
        <div className="max-w-7xl mb-6 pr-6 md:pr-16">
          <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-400">
            If you liked <span className="font-bold text-zinc-100">"{movie.title}"</span> you might also like...
          </h2>
        </div>

        {recommendations.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto overflow-y-hidden pr-6 md:pr-16 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none]">
            {recommendations.map((rec) => (
              <div key={rec.id} className="w-35 md:w-40 shrink-0">
                <MovieCard movie={rec} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-600 font-mono pr-6 md:pr-16">No hay recomendaciones disponibles.</p>
        )}
      </div>
+
    </main>
  );
}