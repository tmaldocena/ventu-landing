import { illustrations } from "@/data/illustrations";

/**
 * Carga los SVG de los fondos como markup inline (no como `<img>`) para poder
 * animar sus trazos con GSAP.
 *
 * Los archivos viven en `public/`, así que se piden por `fetch` con la misma
 * URL que usa la versión `<img>`: no hay que moverlos ni duplicarlos, y si un
 * archivo todavía no existe el fetch falla y el componente cae al placeholder.
 */

export type InlineArt = {
  markup: string;
  sparkles: number;
  lines: number;
};

const cache = new Map<string, InlineArt>();
const pending = new Map<string, Promise<InlineArt>>();
/** 404s: no reintentar en cada remount (al subir el archivo, recargar). */
const failed = new Set<string>();

/** Hash corto y estable para prefijar ids por archivo. */
function hash(value: string): string {
  let h = 5381;
  for (let i = 0; i < value.length; i++) h = (h * 33) ^ value.charCodeAt(i);
  return (h >>> 0).toString(36);
}

/**
 * Los SVG salen de Illustrator con ids genéricos (`paint0_linear_…`,
 * `filter3_f_…`, `clip0_…`). Al inlinear varios en la misma página chocarían,
 * así que se prefijan todos y se reescriben sus referencias.
 */
function scopeIds(doc: Document, prefix: string) {
  const renamed = new Map<string, string>();

  doc.querySelectorAll("[id]").forEach((el) => {
    const old = el.getAttribute("id");
    if (!old) return;
    const next = prefix + old;
    renamed.set(old, next);
    el.setAttribute("id", next);
  });

  if (renamed.size === 0) return;

  const rewrite = (value: string) =>
    value
      .replace(/url\(#([^)]+)\)/g, (_, id: string) => `url(#${renamed.get(id) ?? id})`)
      .replace(/^#(.+)$/, (_, id: string) => `#${renamed.get(id) ?? id}`);

  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const value = attr.value;
      if (value.includes("url(#") || value.startsWith("#")) {
        el.setAttribute(attr.name, rewrite(value));
      }
    }
  });
}

function sanitize(doc: Document) {
  doc.querySelectorAll("script, foreignObject").forEach((el) => el.remove());
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
      if (/^(href|xlink:href)$/i.test(attr.name) && /javascript:/i.test(attr.value)) {
        el.removeAttribute(attr.name);
      }
    }
  });
}

function process(text: string, src: string): InlineArt {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  if (doc.querySelector("parsererror")) throw new Error(`SVG inválido: ${src}`);

  sanitize(doc);
  scopeIds(doc, `vf${hash(src)}-`);

  const svg = doc.documentElement;
  // Mismo encuadre que el `<img class="object-cover">` de mobile.
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  // Roles para el hook de animación. Se marcan por atributos, sin tocar el arte.
  const sparkles = svg.querySelectorAll("g[filter]");
  sparkles.forEach((g) => g.setAttribute("data-fx", "sparkle"));

  const lines = Array.from(svg.querySelectorAll("path[stroke]")).filter(
    (path) => path.getAttribute("stroke") !== "none",
  );
  lines.forEach((path) => path.setAttribute("data-fx", "line"));

  const glows = svg.querySelectorAll('circle[fill^="url("]');
  glows.forEach((circle) => circle.setAttribute("data-fx", "glow"));

  return {
    markup: new XMLSerializer().serializeToString(svg),
    sparkles: sparkles.length,
    lines: lines.length,
  };
}

/** Markup ya procesado, si está en caché (permite render sincrónico). */
export function peekInlineArt(src: string): InlineArt | null {
  return cache.get(src) ?? null;
}

export function loadInlineArt(src: string): Promise<InlineArt> {
  const hit = cache.get(src);
  if (hit) return Promise.resolve(hit);
  if (failed.has(src)) return Promise.reject(new Error(`Sin SVG inline: ${src}`));

  const inflight = pending.get(src);
  if (inflight) return inflight;

  const promise = fetch(src, { credentials: "same-origin" })
    .then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${src}`);
      return res.text();
    })
    .then((text) => {
      const art = process(text, src);
      cache.set(src, art);
      return art;
    })
    .catch((error: unknown) => {
      failed.add(src);
      throw error;
    })
    .finally(() => pending.delete(src));

  pending.set(src, promise);
  return promise;
}

/** Precalienta la caché para que el cambio de perfil no espere red. */
export function preloadInlineArt(ids: string[]) {
  for (const id of ids) {
    const src = illustrations[id]?.src;
    if (src) void loadInlineArt(src).catch(() => {});
  }
}
