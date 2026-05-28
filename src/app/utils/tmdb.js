import axios from "axios";

//defino las URLs base de la API de TMDB tanto para los datos como para las imágenes. esto evita tener que escribir la URL completa en cada petición.
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

//traigo la API Key desde las variables de entorno de next que configure en el .env.local
export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

//creo una instancia personalizada de axios al pasarle 'baseURL', cada vez que usemos 'tmdbApi.get("/algo")', automáticamente se conectará a "https://api.themoviedb.org/3/algo"
export const tmdbApi = axios.create({
	baseURL: TMDB_BASE_URL,
});

/**
 * función auxiliar withApiKey recibe una ruta (ej: "/movie/popular") y le pega al final la API Key. ¿por qué tiene un 'includes("?")'? porque si la ruta ya viene con filtros (ej: "/trending/movie/day?language=es-ES"), los siguientes parámetros se concatenan con "&" en vez de "?". si no tiene "?", empieza los parámetros con "?api_key=...". */
const withApiKey = (path) => {
	const apiKeyQuery = TMDB_API_KEY ? `api_key=${TMDB_API_KEY}` : "api_key=";

	//si el path ya incluye un '?', usamos '&', de lo contrario usamos '?'
	return `${path}${path.includes("?") ? "&" : "?"}${apiKeyQuery}`;
};

//endpoints obligatorios y opcionales. centraliza todas las URLs que pide la consigna del TP en un solo objeto.
export const tmdbEndpoints = {
	trendingMovies: withApiKey("/trending/movie/day"),    // películas en tendencia del día
	popularMovies: withApiKey("/movie/popular"),          // películas populares
	topRatedMovies: withApiKey("/movie/top_rated"),        // películas mejor puntuadas
	nowPlayingMovies: withApiKey("/movie/now_playing"),    // películas en cartelera actualmente
	upcomingMovies: withApiKey("/movie/upcoming"),          // próximos estrenos al cine
	
	//para los detalles necesitamos el ID dinámico de la película. por eso esto es una función que recibe el 'id' y arma la URL correcta.
	movieDetail: (id) => withApiKey(`/movie/${id}`),
	
	//endpoints opcionales para series 
	popularTvShows: withApiKey("/tv/popular"),
	topRatedTvShows: withApiKey("/tv/top_rated"),
	tvShowDetail: (id) => withApiKey(`/tv/${id}`),
};

/** función auxiliar para imgs: getTmdbImageUrl. TMDB no te da la URL completa de la foto, te da un fragmento (ej: "/poster.jpg"). esta función recibe ese fragmento y le antepone la URL base de imágenes para que la etiqueta <img /> funcione */
export const getTmdbImageUrl = (path) => {
	//si la película no tiene foto (viene null o undefined), devolvemos null para evitar romper la app
	if (!path) {
		return null;
	}

	return `${TMDB_IMAGE_BASE_URL}${path}`;
};