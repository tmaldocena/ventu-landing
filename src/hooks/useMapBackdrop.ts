import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Fondo animado del cierre: el mapa se dibuja una sola vez al entrar en
 * pantalla y después queda en un loop ambiente muy lento.
 *
 * Reglas de la casa, igual que en `useArtFx`:
 * - Solo se animan `transform` y `opacity`; nada de filtros.
 * - Se pausa cuando la sección no se ve.
 * - Con `prefers-reduced-motion` queda todo estático en su estado final.
 *
 * Las capas `data-depth` arrancan escaladas 1.12: así el parallax y la deriva
 * nunca descubren el borde del viewBox.
 */
export function useMapBackdrop(ref: RefObject<HTMLElement | null>, ready: boolean) {
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const map = root.querySelector<HTMLElement>("[data-map]");
      if (!map) return;

      const far = map.querySelector<SVGGElement>('[data-depth="far"]');
      const near = map.querySelector<SVGGElement>('[data-depth="near"]');
      // Si el SVG se reemplaza sin las capas, la animación no debe romperse.
      const layers = [far, near].filter((layer): layer is SVGGElement => Boolean(layer));
      const pins = gsap.utils.toArray<SVGGElement>("[data-pin]", map);
      const lines = gsap.utils.toArray<SVGPathElement>("path[stroke]", map);
      const wash = root.querySelector<HTMLElement>("[data-wash]");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(map, { opacity: 1 });
        gsap.set(pins, { opacity: 1, scale: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // El largo de cada trazo se mide una vez, con el SVG ya en el DOM.
        const lengths = lines.map((line) => line.getTotalLength());
        lines.forEach((line, i) => {
          gsap.set(line, { strokeDasharray: lengths[i], strokeDashoffset: lengths[i] });
        });

        gsap.set(map, { opacity: 0 });
        if (layers.length) {
          gsap.set(layers, { scale: 1.12, transformOrigin: "50% 50%", force3D: true });
        }
        gsap.set(pins, { opacity: 0, scale: 0.4, transformOrigin: "50% 100%" });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

        tl.to(map, { opacity: 1, duration: 0.6 }, 0)
          // Un único tween con stagger: no un tween por línea.
          .to(lines, { strokeDashoffset: 0, duration: 1.1, stagger: 0.03, ease: "power2.inOut" }, 0.08)
          .to(pins, { opacity: 1, scale: 1, duration: 0.55, stagger: 0.08, ease: "back.out(2.2)" }, 0.85);

        const ambient: gsap.core.Tween[] = [];

        const startAmbient = () => {
          if (ambient.length) return;

          // Deriva en px (no `yPercent`: ese carril lo usa el parallax).
          if (far) {
            ambient.push(
              gsap.to(far, { x: 12, y: 9, duration: 26, repeat: -1, yoyo: true, ease: "sine.inOut" }),
            );
          }
          if (near) {
            ambient.push(
              gsap.to(near, { x: -16, y: 11, duration: 19, repeat: -1, yoyo: true, ease: "sine.inOut" }),
            );
          }
          pins.forEach((pin, i) => {
            ambient.push(
              gsap.to(pin, {
                scale: 1.1,
                duration: 3.4 + (i % 3) * 0.7,
                delay: i * 0.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              }),
            );
          });
          if (wash) {
            ambient.push(
              gsap.to(wash, { opacity: 0.82, duration: 16, repeat: -1, yoyo: true, ease: "sine.inOut" }),
            );
          }
        };

        tl.eventCallback("onComplete", startAmbient);

        // Parallax de profundidad mientras la sección cruza el viewport.
        const parallax = gsap.timeline({
          scrollTrigger: {
            trigger: root.closest("section") ?? root,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
        if (far) parallax.fromTo(far, { yPercent: 3 }, { yPercent: -3, ease: "none" }, 0);
        if (near) parallax.fromTo(near, { yPercent: 7 }, { yPercent: -7, ease: "none" }, 0);

        const setWillChange = (on: boolean) => {
          for (const layer of layers) layer.style.willChange = on ? "transform" : "";
        };

        const io = new IntersectionObserver(
          ([entry]) => {
            const on = entry.isIntersecting;
            if (on) {
              if (tl.progress() < 1) tl.play();
              else ambient.forEach((tween) => tween.resume());
            } else {
              if (tl.progress() < 1) tl.pause();
              else ambient.forEach((tween) => tween.pause());
            }
            setWillChange(on);
          },
          { rootMargin: "0px 0px -15% 0px" },
        );
        io.observe(root);

        return () => {
          io.disconnect();
          setWillChange(false);
          ambient.forEach((tween) => tween.kill());
        };
      });
    },
    [ready],
  );
}
