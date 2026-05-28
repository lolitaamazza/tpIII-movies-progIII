# CINEAPP // INTERACTIVE MOVIES PLATFORM

Una aplicación web interactiva y responsive para la exploración de catálogos cinematográficos en tiempo real, conectada de manera directa con la API global de The Movie Database (TMDB).

## TECNOLOGÍAS UTILIZADAS

* **Framework:** Next.js 15+ (App Router)
* **Librería de Interfaz:** React 19
* **Estilos y Layout:** Tailwind CSS v4 
* **Cliente de Consultas:** Axios
* **Persistencia de Datos:** Web Storage API (localStorage)

## INSTRUCCIONES DE INSTALACIÓN

Seguí estos pasos para clonar el repositorio e instalar todas las dependencias necesarias en tu entorno local:

1. **Clonar el repositorio:**
   ```bash```
git clone https://github.com/tu-usuario/maimo-prog3-2026-tp3-movies.git
cd maimo-prog3-2026-tp3-movies

2. **Instalar dependencias del proyecto:**

npm install

3. **Configurar las variables de entorno:**
Creá un archivo llamado `.env.local` en la raíz del proyecto y agregá tu credencial de autorización de TMDB:
   ```env```
NEXT_PUBLIC_TMDB_API_KEY=tu_api_key_aqui

## INSTRUCCIONES PARA EJECUTAR EL PROYECTO
Para levantar el servidor de desarrollo local y previsualizar la plataforma en tiempo real:

npm run dev
Una vez ejecutado el comando, abrí tu navegador e ingresá a:
http://localhost:3000


## ENDPOINTS UTILIZADOS
Las consultas se gestionan de forma centralizada mediante una instancia configurada de Axios, consumiendo los siguientes recursos oficiales de TMDB:
* Películas en Tendencia: /trending/movie/day
* Películas Populares: /movie/popular
* Mejor Puntuadas: /movie/top_rated
* En Cartelera: /movie/now_playing
* Próximos Estrenos: /movie/upcoming
* Búsqueda Dinámica: /search/movie?query={query}
* Detalle Específico: /movie/{id}
* Reparto y Créditos: /movie/{id}/credits

## DECLARACIÓN DE USO DE IA

### En qué me dio una mano:
* **Maquetado y UI:** Refactorizar componentes y acomodar clases de Tailwind CSS 
* **Lógica de Favoritos:** Diseñar los eventos personalizados (`CustomEvent`) para que cuando toques un corazón, el slider de favoritos de abajo se entere y se actualice sin recargar.
* **Limpieza de UX:** Reestructurar las pantallas (como el detalle de la película) para unificar datos sueltos dentro de bloques visuales con más jerarquía.
* **Manejo de Errores:** Explicarme qué significaba cada issue, por qué se estaba rompiendo y cómo encarar la solución paso a paso para aprender a arreglarlo.
