# armandopepe-web

Front React (Vite) + MUI: listado y ficha de propiedades, consumiendo la API del repositorio **armandopepe-api**.

## Requisitos

- Node.js 20+

## Puesta en marcha

1. `npm install`
2. Copiar [`.env.example`](.env.example) a **`.env`** o **`.env.development`** (ya hay un [`.env.development`](.env.development) de ejemplo apuntando al backend en `http://localhost:3000/api`).
3. Tener levantado el backend en el mismo `PORT` que el de tu `.env` (por defecto 3000).
4. `npm run dev` — abre la URL que indique Vite (suele ser [http://localhost:5173](http://localhost:5173)).

## Variable de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_API_BASE_URL` | Origen de la API **incluyendo** el prefijo `/api`, p. ej. `http://localhost:3000/api` |

Vite solo expone variables con prefijo `VITE_`.

## Rutas

- `/` — home
- `/propiedades` — listado de propiedades
- `/propiedades/:id` — ficha de propiedad
- `/tasaciones` — formulario de tasaciones
- `/contacto` — formulario de contacto
- `/admin` — acceso al backoffice (vía login modal)

## Build

`npm run build` genera `dist/` con estáticos listos para servir detrás de cualquier CDN o Nginx.
