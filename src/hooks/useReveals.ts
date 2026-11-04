import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Reveal genérico al scrollear.
 *
 * Anima los `[data-reveal]` dentro de `scope` con fade + subida, en tandas
 * (`ScrollTrigger.batch`) para que los grids entren escalonados. Se dispara una
 * sola vez por elemento y no hace nada con `prefers-reduced-motion`.
 *
 * `dependencies` sirve para las secciones que cambian de contenido (perfil
 * vecino/emprendedor): al cambiar, el contexto se revierte y se vuelve a armar.
 */
export function useReveals(scope: RefObject<HTMLElement | null>, dependencies: unknown[] = []) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
        if (!items.length) return;

        // Solo opacidad (sin visibility) para que el contenido siga siendo
        // accesible por teclado y lectores de pantalla antes de revelarse.
        // Los anclajes (#v-… / #e-…) usan data-reveal="fade": si además se
        // movieran en Y, el salto del hash quedaría 24px corrido.
        const fadeOnly = (el: HTMLElement) => el.dataset.reveal === "fade";
        gsap.set(items, { opacity: 0 });
        gsap.set(items.filter((el) => !fadeOnly(el)), { y: 24 });

        // Si la sección ya está en pantalla (por ejemplo al cambiar de perfil),
        // `ScrollTrigger.batch` no dispara `onEnter`: animamos esa tanda acá.
        const inView = items.filter((el) => el.getBoundingClientRect().top < window.innerHeight * 0.9);
        if (inView.length) {
          gsap.fromTo(
            inView,
            { opacity: 0 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 },
          );
        }

        const triggers = ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.08,
            }),
        });

        return () => triggers.forEach((t) => t.kill());
      });

      return () => mm.revert();
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}
