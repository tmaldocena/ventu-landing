import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Animación de los fondos inline de “Tres pasos”.
 *
 * Cada escena entra “dibujándose”: los trazos se trazan con
 * `strokeDasharray`/`strokeDashoffset`, los destellos dorados aparecen en
 * cascada y el conjunto hace un zoom mínimo. Después queda un loop ambiente
 * (destellos que titilan, respiración de la escena y pulso del glow) que se
 * pausa cuando la escena no se ve (fuera de pantalla o tapada por el cruce de
 * pasos).
 *
 * Solo se usan `transform`, `opacity` y `strokeDashoffset`; nunca se animan
 * los filtros de blur, que son lo caro de estos SVG.
 */

type Scene = {
  box: HTMLElement;
  art: HTMLElement;
  svg: SVGSVGElement;
  lines: SVGPathElement[];
  lengths: number[];
  sparkles: SVGGElement[];
  glows: SVGCircleElement[];
  entry?: gsap.core.Timeline;
  twinkles: gsap.core.Tween[];
  breath?: gsap.core.Tween;
  glowTween?: gsap.core.Tween;
  /** La escena está en pantalla y es el paso visible del mazo. */
  active: boolean;
  /** Observa la opacidad del paso (el cruce entre tarjetas la cambia). */
  watcher: MutationObserver;
};

const START_SCALE = 1.02;
/** Debajo de esto el paso está tapado: no vale la pena animarlo. */
const HIDDEN = 0.04;

function applyInitial(scene: Scene) {
  // La escala va sobre el contenedor, no sobre el `<svg>`: así el navegador
  // compone la capa ya rasterizada y no re-ejecuta los 14 blurs por frame.
  gsap.set(scene.art, { scale: START_SCALE, transformOrigin: "55% 60%" });
  gsap.set(scene.sparkles, { opacity: 0 });
  scene.lines.forEach((line, i) => {
    gsap.set(line, { strokeDasharray: scene.lengths[i], strokeDashoffset: scene.lengths[i] });
  });
}

function buildEntry(scene: Scene) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

  tl.to(scene.art, { scale: 1, duration: 1.1, ease: "power3.out" }, 0);

  if (scene.lines.length) {
    tl.to(
      scene.lines,
      {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: "power2.inOut",
        stagger: Math.min(0.02, 0.6 / scene.lines.length),
      },
      0.12,
    );
  }

  if (scene.glows.length) {
    tl.fromTo(
      scene.glows,
      { scale: 0.94, opacity: 0.55 },
      { scale: 1, opacity: 1, duration: 1.1, ease: "power2.out" },
      0,
    );
  }

  if (scene.sparkles.length) {
    tl.to(
      scene.sparkles,
      { opacity: 1, duration: 0.45, ease: "power1.out", stagger: 0.045 },
      0.3,
    );
  }

  tl.eventCallback("onComplete", () => startAmbient(scene));

  return tl;
}

function startAmbient(scene: Scene) {
  // Si la escena se ocultó justo al terminar la entrada, no arrancamos un loop
  // que no se ve: se retoma cuando vuelva a estar activa.
  if (!scene.active) return;

  scene.twinkles.forEach((tween) => tween.kill());
  scene.twinkles = [];
  scene.breath?.kill();
  scene.glowTween?.kill();

  // Los destellos ya están en 1 al terminar la entrada; desde ahí titilan.
  gsap.set(scene.sparkles, { opacity: 1 });
  scene.sparkles.forEach((sparkle, i) => {
    scene.twinkles.push(
      gsap.fromTo(
        sparkle,
        { opacity: 1 },
        {
          opacity: 0.5,
          duration: 1.3 + (i % 5) * 0.4,
          delay: (i % 7) * 0.13,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
      ),
    );
  });

  scene.breath = gsap.to(scene.art, {
    scale: 1.012,
    duration: 9,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  if (scene.glows.length) {
    scene.glowTween = gsap.to(scene.glows, {
      scale: 1.035,
      opacity: 0.85,
      duration: 5.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
}

function sceneAnims(scene: Scene) {
  const anims: gsap.core.Animation[] = [];
  if (scene.entry && scene.entry.progress() < 1) anims.push(scene.entry);
  anims.push(...scene.twinkles);
  if (scene.breath) anims.push(scene.breath);
  if (scene.glowTween) anims.push(scene.glowTween);
  return anims;
}

function startEntry(scene: Scene) {
  scene.twinkles.forEach((tween) => tween.kill());
  scene.twinkles = [];
  scene.breath?.kill();
  scene.breath = undefined;
  scene.glowTween?.kill();
  scene.glowTween = undefined;
  applyInitial(scene);
  scene.box.dataset.fxPlayed = "1";
  scene.entry?.restart();
}

/**
 * Una escena solo corre si la sección está en pantalla **y** su paso es el
 * visible. El cruce entre pasos baja la opacidad de los otros dos, así que
 * ahí se pausan: no tiene sentido animar destellos que nadie ve.
 */
function syncScene(scene: Scene, visible: boolean) {
  const next = visible && Number(getComputedStyle(scene.box).opacity) > HIDDEN;
  if (next === scene.active) return;
  scene.active = next;

  if (next) {
    // `will-change` solo mientras la escena se mueve: promueve la capa para no
    // re-rasterizar los filtros en cada frame, sin dejarla reservada siempre.
    scene.art.dataset.animating = "1";

    if (scene.box.dataset.fxPlayed !== "1") {
      startEntry(scene);
      return;
    }

    if (scene.entry?.progress() === 1 && !scene.twinkles.length) startAmbient(scene);
    sceneAnims(scene).forEach((anim) => anim.resume());
    return;
  }

  sceneAnims(scene).forEach((anim) => anim.pause());
  delete scene.art.dataset.animating;
}

export function useArtFx(ref: RefObject<HTMLElement | null>, deps: readonly unknown[]) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // El disparo se ancla al bloque pinneado, no a la sección entera: la
    // sección es varias veces más alta que la pantalla, así que observarla
    // arrancaba el dibujo cuando todavía no se veía el mazo. Con este margen
    // la entrada empieza cuando las tarjetas llegan a la mitad de la pantalla,
    // y sigue dibujándose ya con el bloque fijo.
    const stage = root.querySelector<HTMLElement>("[data-stage]") ?? root;

    const scenes: Scene[] = [];
    const byBox = new Map<HTMLElement, Scene>();
    let visible = false;
    let frame = 0;

    const syncAll = () => {
      frame = 0;
      scenes.forEach((scene) => syncScene(scene, visible));
    };
    const scheduleSync = () => {
      if (!frame) frame = requestAnimationFrame(syncAll);
    };

    const drop = (scene: Scene) => {
      scene.watcher.disconnect();
      scene.entry?.kill();
      scene.twinkles.forEach((tween) => tween.kill());
      scene.breath?.kill();
      scene.glowTween?.kill();
      delete scene.art.dataset.animating;
      delete scene.box.dataset.fxPlayed;
      byBox.delete(scene.box);
      const index = scenes.indexOf(scene);
      if (index >= 0) scenes.splice(index, 1);
    };

    const add = (box: HTMLElement) => {
      if (byBox.has(box)) return;

      const art = box.querySelector<HTMLElement>("[data-inline-art]");
      const svg = art?.querySelector<SVGSVGElement>("svg");
      // Sin inline (archivo faltante o todavía en camino): se queda el `<img>`
      // y se volverá a intentar cuando el markup entre al DOM.
      if (!art || !svg) return;

      const lines = gsap.utils.toArray<SVGPathElement>('[data-fx="line"]', svg);
      const scene: Scene = {
        box,
        art,
        svg,
        lines,
        lengths: lines.map((line) => line.getTotalLength()),
        sparkles: gsap.utils.toArray<SVGGElement>('[data-fx="sparkle"]', svg),
        glows: gsap.utils.toArray<SVGCircleElement>('[data-fx="glow"]', svg),
        twinkles: [],
        active: false,
        watcher: new MutationObserver(scheduleSync),
      };

      // Estado de partida oculto: si el SVG llega con la sección a la vista,
      // no se alcanza a ver el dibujo terminado antes de que entre.
      applyInitial(scene);
      scene.entry = buildEntry(scene);

      scene.watcher.observe(box, { attributes: true, attributeFilter: ["style"] });
      scenes.push(scene);
      byBox.set(box, scene);
    };

    const scan = () => {
      // Primero descartar escenas cuyo paso salió del DOM (cambio de perfil) o
      // cuyo SVG fue reemplazado; después sumar las que todavía no tienen una.
      [...scenes].forEach((scene) => {
        if (!root.contains(scene.box) || !scene.box.contains(scene.svg)) drop(scene);
      });
      root.querySelectorAll<HTMLElement>("[data-step-bg]").forEach(add);
    };

    scan();

    // El SVG inline llega por fetch (y las tarjetas cambian con el perfil):
    // se descubre solo, sin re-ejecutar el efecto ni reiniciar el resto.
    const domWatcher = new MutationObserver(() => {
      scan();
      scheduleSync();
    });
    domWatcher.observe(root, { childList: true, subtree: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting;
        if (next === visible) return;
        visible = next;
        scheduleSync();
      },
      { rootMargin: "0px 0px -50% 0px" },
    );
    io.observe(stage);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      domWatcher.disconnect();
      [...scenes].forEach(drop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
