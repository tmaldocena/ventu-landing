import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Línea de progreso de lectura: avanza con el scroll de toda la página.
 * Terracota de marca, 2px, por encima del nav.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = bar.current;
      if (!el) return;

      // Entra recién cuando el hero quedó atrás: en el primer viewport la
      // línea no aporta y competía con el borde del nav.
      gsap.fromTo(
        el,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: { start: 140, end: 360, scrub: 0.3 },
        },
      );

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
          },
        );
      });

      // Con menos movimiento no hay suavizado: la barra sigue el scroll exacto.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: bar },
  );

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 rounded-r-full bg-primary"
    />
  );
}
