/**
 * Registro de ilustraciones y capturas.
 *
 * Cada slot de la landing referencia un id (IL-02, CAPTURA-01…).
 * Mientras `src` esté vacío se muestra un placeholder con la descripción.
 * Para reemplazarlo: poné el archivo en /public/illustrations/ y completá `src`.
 *
 *   "IL-02": { label: "...", src: "/illustrations/il-02-mapa.svg", alt: "Mapa del barrio" }
 */
export type IllustrationSpec = {
  label: string;
  src?: string;
  alt?: string;
  poster?: string;
};

export const illustrations: Record<string, IllustrationSpec> = {
  // Hero — Ventu (ya disponible)
  "IL-01": {
    label: "Ventu, la luciérnaga guía, con un mapa",
    src: "/ventu.webp",
    alt: "Ventu, la luciérnaga guía, con un mapa en las manos",
  },

  // Cómo funciona — vecino
  "IL-02": {
    label: "Mapa del barrio con pins de emprendimientos",
    src: "/illustrations/il-02-mapa.svg",
    alt: "Mapa del barrio con pines de emprendimientos",
  },
  "IL-03": {
    label: "Lupa con filtros / etiquetas de rubro",
    src: "/illustrations/il-03-filtros.svg",
    alt: "Lupa con filtros y etiquetas de rubro",
  },
  "IL-04": {
    label: "Mano con celular y burbuja de WhatsApp",
    src: "/illustrations/il-04-whatsapp.svg",
    alt: "Mano con celular y burbuja de WhatsApp",
  },
  // Cómo funciona — emprendedor
  "IL-05": {
    label: "Persona armando su perfil con checklist de onboarding",
    src: "/illustrations/il-05-perfil.svg",
    alt: "Persona armando su perfil con una checklist de onboarding",
  },
  "IL-06": {
    label: "Vidriera / escaparate con productos del emprendimiento",
    src: "/illustrations/il-06-vidriera.svg",
    alt: "Vidriera con productos del emprendimiento",
  },
  "IL-07": {
    label: "Celular con mensajes entrantes y estrellas de valoración",
    src: "/illustrations/il-07-valoraciones.svg",
    alt: "Celular con mensajes entrantes y estrellas de valoración",
  },

  // Funciones
  "IL-08": { label: "Ilustración principal: mapa con pins y tarjeta flotante" },
  "IL-09": { label: "Ilustración: buscador con chips de filtros" },
  "IL-10": { label: "Ilustración: burbuja de chat que sale del perfil" },
  "IL-11": { label: "Ilustración: estrellas, corazones y manos de vecinos" },
  "IL-12": { label: "Ilustración: camino con hitos / checklist que avanza" },
  "CAPTURA-01": { label: "Screenshot real de la pantalla del mapa", src: "/mockups/map-mockup.mov" },
  "CAPTURA-02": { label: "Screenshot de búsqueda + filtros", src: "/mockups/search-mockup.mov" },
  "CAPTURA-03": { label: "Screenshot del botón de contacto en el perfil", src: "/mockups/contacto-mockup.mov" },
  "CAPTURA-04": { label: "Screenshot de rating en un perfil", src: "/mockups/rating-mockup.mov" },
  "CAPTURA-05": { label: "Screenshot de una pantalla del onboarding", src: "/mockups/onboarding-mockup.mov" },

  // Guía — vecino
  "IL-13": {
    label: "Mano tocando un pin en el mapa",
    src: "/screenshots/il-13.webp",
    alt: "Pantalla del mapa con varios pins"
  },
  "IL-14": {
    label: "Panel de filtros desplegado",
    src: "/screenshots/il-14.webp",
    alt: "Panel de filtros desplegado"
  },
  "IL-15": {
    label: "Del botón de contacto a la ventana de WhatsApp",
    src: "/screenshots/il-15.webp",
    alt: "Boton de contacto a Whatsapp directo desde el perfil"
  },
  "IL-16": {
    label: "Estrellas llenándose, vecino sonriendo",
    src: "/screenshots/il-16.png",
    alt: "Sistema de rating para emprendimientos"
  },
  // Guía — emprendedor
  "IL-17": {
    label: "Pantallas de onboarding en secuencia",
    src: "/screenshots/il-17.webp",
    alt: "Creación de cuenta y perfil como emprendedor"
  },
  "IL-18": {
    label: "Vidriera con productos y cámara",
    src: "/screenshots/il-18.webp",
  },
  "IL-19": {
    label: "Emprendedor respondiendo desde el celular",
    src: "/screenshots/il-19.webp",
  },
  "IL-20": {
    label: "Perfil con estrellas y medalla",
    src: "/screenshots/il-20.webp",
  },

  // Cierre
  "IL-21": {
    label: "Ventu sosteniendo un móvil con la app",
    src: "/illustrations/il-08-cta.png",
    alt: "Ventu sosteniendo un móvil con la app de Ventu abierta",
  },

  // Fondos — linework que se dibuja con GSAP (ver useMapBackdrop).
  "BG-01": {
    label: "Mapa del barrio",
    src: "/illustrations/bg-cierre-mapa.svg",
  },
};
