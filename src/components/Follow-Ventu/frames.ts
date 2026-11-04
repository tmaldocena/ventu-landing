/**
 * Los nueve frames de Ventu (una dirección de mirada cada uno).
 *
 * Vite los resuelve en build time: en dev apunta a los archivos de `frames/`
 * y en producción a los assets con hash. Así no hace falta duplicarlos en
 * `public/` ni mantener rutas a mano.
 */
const modules = import.meta.glob("./frames/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const mascotFrames: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => [
    path.slice(path.lastIndexOf("/") + 1).replace(/\.webp$/, ""),
    url,
  ]),
);
