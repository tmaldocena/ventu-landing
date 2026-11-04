import { useEffect, type RefObject } from "react";

/**
 * Publica la posición del cursor sobre `ref` como variables CSS:
 *   --mx, --my  →  valores entre -1 y 1 (0 = centro)
 *
 * Los elementos hijos se mueven con CSS puro, sin re-renderizar React:
 *   transform: translate(calc(var(--mx, 0) * 14px), calc(var(--my, 0) * 10px));
 *
 * Se desactiva en pantallas táctiles y con prefers-reduced-motion.
 */
export function useCursorParallax<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none)").matches
    ) {
      return;
    }

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", String(((e.clientX - r.left) / r.width) * 2 - 1));
        el.style.setProperty("--my", String(((e.clientY - r.top) / r.height) * 2 - 1));
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}
