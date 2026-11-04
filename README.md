# Ventu

Landing page oficial de **Ventu**. Construida con Vite, React 19, TypeScript, Tailwind CSS v4 y GSAP.

## ✨ Tecnologías

- [Vite](https://vitejs.dev/) — Bundler y servidor de desarrollo
- [React 19](https://react.dev/) — UI
- [TypeScript](https://www.typescriptlang.org/) — Tipado estático
- [Tailwind CSS v4](https://tailwindcss.com/) — Estilos
- [GSAP](https://gsap.com/) + [@gsap/react](https://gsap.com/resources/React/) — Animaciones
- [Nunito Variable](https://fontsource.org/fonts/nunito) — Tipografía

## 📋 Requisitos

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) (incluido con Node)

## 🚀 Empezar en local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/ventu.git
cd ventu

# 2. Instalar dependencias
npm install

# 3. Levantar entorno de desarrollo
npm run dev
```

La app quedará disponible en [http://localhost:5173](http://localhost:5173).

## 📜 Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Ejecuta `tsc --noEmit` y genera el build de producción en `/dist` |
| `npm run preview` | Sirve localmente el build generado para previsualizarlo |
| `npm run typecheck` | Solo valida tipos con TypeScript sin generar archivos |

## 🏗️ Build y preview

```bash
# Generar build de producción
npm run build

# Previsualizar build
npm run preview
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 📁 Estructura del proyecto

```text
src/
├─ components/      # Componentes UI, secciones, hero, etc.
├─ context/         # Contextos globales (perfil vecino/emprendedor)
├─ data/            # Copy, ilustraciones y configuración
├─ hooks/           # Hooks personalizados (reveal, parallax)
├─ lib/             # Utilidades y configuración de GSAP
├─ styles/          # Tokens de diseño (VentuUI) y CSS global
└─ main.tsx         # Punto de entrada

public/             # Assets estáticos (imágenes, ilustraciones)
index.html          # HTML base
vite.config.ts      # Configuración de Vite + alias @
```

Los tokens de diseño viven en `src/styles/tokens.css`. Para actualizar colores, radios o sombras desde Figma, es recomendable modificar **únicamente** ese archivo.

## 🌐 Despliegue

Este proyecto genera archivos estáticos, por lo que puede desplegarse fácilmente en:

- [Vercel](https://vercel.com/) — Importar repo, build command `npm run build`, output `dist`
- [Netlify](https://www.netlify.com/) — Mismo comando y directorio `dist`
- [Cloudflare Pages](https://pages.cloudflare.com/) — Soporta Vite sin configuración extra

## 🗂️ Crear y subir el repo por primera vez

Si aún no creaste el repositorio en GitHub/GitLab, desde la raíz del proyecto:

```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "chore: initial commit"

# Cambiar a rama main
git branch -M main

# Agregar remoto (reemplazar con tu URL)
git remote add origin git@github.com:tu-usuario/ventu.git
# o: git remote add origin https://github.com/tu-usuario/ventu.git

# Subir al remoto
git push -u origin main
```

## 🔒 Notas

- `package.json` tiene `"private": true`, pensado para uso interno/privado.
- Hay assets e ilustraciones en `public/` listos para reemplazar por versiones finales.
- Las animaciones respetan `prefers-reduced-motion`.

## 📄 Licencia

Este proyecto es privado. No está destinado a uso público sin autorización.
