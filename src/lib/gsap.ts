import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Punto único de GSAP para la landing.
 *
 * - Registra ScrollTrigger una sola vez (el plugin se auto-registra por módulo,
 *   pero registrarlo acá evita problemas de tree-shaking).
 * - Refresca las medidas cuando terminan de cargar las fuentes y las imágenes:
 *   sin esto, el pin y los `start` de ScrollTrigger pueden quedar corridos
 *   porque Nunito cambia el alto de los títulos después del primer render.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

let refreshBound = false;

if (typeof window !== "undefined" && !refreshBound) {
  refreshBound = true;
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh, { once: true });
  document.fonts?.ready.then(refresh).catch(() => {});
}

export { gsap, ScrollTrigger, useGSAP };
