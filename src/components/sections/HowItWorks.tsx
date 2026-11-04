import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { steps } from "@/data/content";
import { useProfile } from "@/context/ProfileContext";
import { useArtFx } from "@/hooks/useArtFx";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReveals } from "@/hooks/useReveals";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { preloadInlineArt } from "@/lib/inlineSvg";
import { Container } from "@/components/ui/Container";
import { Illustration } from "@/components/ui/Illustration";
import { InlineIllustration } from "@/components/ui/InlineIllustration";
import { ProfileSwitch } from "@/components/ui/ProfileSwitch";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Posición de una tarjeta dentro del mazo: 0 = al frente, 1 y 2 = detrás. */
type Slot = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
  zIndex: number;
};

const SLOTS: Slot[] = [
  { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 30 },
  { x: -40, y: 30, scale: 0.94, rotate: -3, opacity: 0.5, zIndex: 20 },
  { x: 52, y: 64, scale: 0.88, rotate: 3, opacity: 0.28, zIndex: 10 },
];

/** Slot que le toca a la tarjeta `j` cuando el paso activo es `step`. */
const slotFor = (j: number, step: number, total: number) =>
  SLOTS[(((j - step) % total) + total) % total];

/** Solo las variables de movimiento: el z se cambia de golpe, no se interpola. */
const motion = ({ x, y, scale, rotate, opacity }: Slot) => ({ x, y, scale, rotate, opacity });

export function HowItWorks() {
  const { profile } = useProfile();
  const ref = useRef<HTMLElement>(null);

  // Lo que se pinta en el mazo. Va un paso atrás de `profile` durante el
  // cruce: el switch responde al toque y el contenido llega con un fundido.
  const [shownProfile, setShownProfile] = useState(profile);
  const shownRef = useRef(profile);

  // El SVG inline solo tiene sentido donde existe la capa sticky del fondo
  // (desktop y sin reduced motion). En mobile sigue el `<img>` de siempre.
  const inlineArt = useMediaQuery("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");

  // Traer los SVG de los dos perfiles antes de que se toque el switch: así el
  // cruce encuentra el markup en caché y no espera red.
  useEffect(() => {
    if (!inlineArt) return;
    preloadInlineArt([...steps.vecino, ...steps.emprendedor].map((step) => step.illustration));
  }, [inlineArt]);

  // Entrada dibujada + loop ambiente de los fondos inline. El hook descubre
  // solo las escenas que se montan (carga del SVG, cambio de perfil), así que
  // no hay que reiniciarlo con cada render.
  useArtFx(ref, [inlineArt]);

  // Solo una vez: re-ejecutarlo en cada cambio de perfil apagaba y volvía a
  // encender toda la sección (se sentía como un reload). El cruce lo maneja
  // el efecto de abajo.
  useReveals(ref, []);

  // Cambio de perfil: fundido del mazo y del arte sobre `bg-night`. El corte
  // de contenido ocurre a mitad del fundido, cuando ya no se ve.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const deck = root.querySelector<HTMLElement>("[data-stack]");
    const art = root.querySelector<HTMLElement>("[data-stage-art]");

    const commit = () => {
      shownRef.current = profile;
      setShownProfile(profile);
    };

    // Sin mazo no hay nada que fundir: el contenido cambia igual.
    if (!deck) {
      commit();
      return;
    }

    // Un cruce anterior pudo quedar a mitad de camino: lo descartamos antes de
    // decidir qué animar, si no sus tweens compiten con los nuevos.
    gsap.killTweensOf(deck);
    if (art) gsap.killTweensOf(art);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Volvió al perfil que ya está en pantalla (clicks rápidos ida y vuelta):
    // el fundido de salida se cortó, así que devolvemos mazo y arte a la vista.
    if (profile === shownRef.current) {
      const deckHidden =
        Number(getComputedStyle(deck).opacity) < 0.999 ||
        Math.abs(Number(gsap.getProperty(deck, "y"))) > 0.01;
      const artHidden = art !== null && Number(getComputedStyle(art).opacity) < 0.999;
      if (!deckHidden && !artHidden) return;

      if (reduced) {
        gsap.set(deck, { opacity: 1, y: 0 });
        if (art) gsap.set(art, { opacity: 1 });
        return;
      }
      gsap.to(deck, { opacity: 1, y: 0, duration: 0.24, ease: "power2.out" });
      if (art) gsap.to(art, { opacity: 1, duration: 0.24, ease: "power2.out" });
      return;
    }

    // Sin animación: cambio inmediato.
    if (reduced) {
      commit();
      gsap.set(deck, { opacity: 1, y: 0 });
      if (art) gsap.set(art, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    tl.to(deck, { opacity: 0, y: -6, duration: 0.14, ease: "power2.in" }, 0.03);
    if (art) tl.to(art, { opacity: 0, duration: 0.18, ease: "power2.in" }, 0);
    tl.call(commit, [], 0.2);
    tl.set(deck, { y: 8 }, 0.2);
    tl.to(deck, { opacity: 1, y: 0, duration: 0.34, ease: "power2.out" }, 0.22);
    if (art) tl.to(art, { opacity: 1, duration: 0.42, ease: "power2.out" }, 0.2);

    return () => {
      tl.kill();
    };
  }, [profile]);

  // Desktop: las tres tarjetas se apilan en un mazo. La del frente ocupa el
  // centro; al scrollear baja y se va al fondo mientras la siguiente sube.
  // El fondo ilustrado de la sección cruza en sincronía con cada paso.
  //
  // En mobile/tablet y con reduced motion no se toca nada: queda la grilla
  // normal (ver las reglas [data-mode="stage"] en index.css).
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const stack = root.querySelector<HTMLElement>("[data-stack]");
      const stage = root.querySelector<HTMLElement>("[data-stage]");
      if (!stack || !stage) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-step]", stack);
        const bgs = gsap.utils.toArray<HTMLElement>("[data-step-bg]", root);
        const total = cards.length;
        if (total < 2) return;

        root.dataset.mode = "stage";

        gsap.set(cards, { transformOrigin: "center center", force3D: true });
        cards.forEach((card, j) => {
          const slot = slotFor(j, 0, total);
          gsap.set(card, { ...motion(slot), zIndex: slot.zIndex });
        });

        if (bgs.length === total) {
          gsap.set(bgs, { opacity: 0 });
          gsap.set(bgs[0], { opacity: 1 });
        }

        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power2.inOut" },
          scrollTrigger: {
            // Se pinnea el bloque entero (switch + mazo) para poder cambiar de
            // perfil sin volver a subir.
            trigger: stage,
            start: "top 18%",
            end: () => `+=${Math.round(window.innerHeight * 1.1)}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 1; i < total; i++) {
          const at = i - 0.9;

          cards.forEach((card, j) => {
            const slot = slotFor(j, i, total);
            // El orden se cambia a mitad del cruce, cuando las dos tarjetas se
            // superponen: así no se ve el salto de z-index.
            tl.set(card, { zIndex: slot.zIndex, immediateRender: false }, at + 0.5);
            tl.to(card, motion(slot), at);
          });

          if (bgs.length === total) {
            tl.to(bgs[i - 1], { opacity: 0, duration: 0.7 }, at + 0.15);
            tl.to(bgs[i], { opacity: 1, duration: 0.7 }, at + 0.15);
          }
        }

        // El alto del mazo depende del perfil: recalcular el pin.
        const refresh = gsap.delayedCall(0.15, () => ScrollTrigger.refresh());

        return () => {
          refresh.kill();
          root.dataset.mode = "cards";
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [shownProfile], revertOnUpdate: true },
  );

  return (
    <section id="como" ref={ref} data-mode="cards" className="relative isolate bg-night py-24">
      {/* Fondo ilustrado del mazo. Cambia con el paso y cubre toda la sección:
          el bloque es nocturno, en continuidad con el hero. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Empalme con el hero en mobile/tablet: ahí no hay capa sticky, así
            que la sección arranca directo en `bg-night` y quedaría un
            escalón de color. En desktop lo cubre el empalme de abajo. */}
        <div
          data-seam
          className="absolute inset-x-0 top-0 h-[150px]"
          style={{ backgroundImage: "linear-gradient(to bottom, #1b3c5e, transparent)" }}
        />

        <div data-stage-bg className="sticky top-0 h-svh w-full overflow-hidden">
          {/* El arte es lo único que se funde al cambiar de perfil; el empalme
              con el hero queda fijo para que el borde no parpadee. */}
          <div data-stage-art className="absolute inset-0">
            {steps[shownProfile].map((step) => (
              <div key={step.illustration} data-step-bg className="absolute inset-0">
                {inlineArt ? (
                  <InlineIllustration id={step.illustration} />
                ) : (
                  <Illustration id={step.illustration} variant="fill" />
                )}
              </div>
            ))}
          </div>

          {/* Sin velo blanco: el arte llega hasta los bordes. Solo un empalme
              corto con el azul con el que termina el hero (bg-night-sky →
              #1b3c5e). Al vivir en la capa sticky, también queda fijo arriba
              durante el pin y sostiene la lectura del título. */}
          <div
            className="absolute inset-x-0 top-0 h-[16%]"
            style={{ backgroundImage: "linear-gradient(to bottom, #1b3c5e, transparent)" }}
          />
        </div>
      </div>

      <Container className="relative">
        <SectionHeading
          eyebrow="Cómo funciona"
          title="Tres pasos y listo."
          lead="Ventu tiene dos caras. Elegí la tuya."
          tone="dark"
          className="mb-10"
        />

        <div data-stage data-reveal="fade">
          {/* Adentro del bloque pinneado: se puede cambiar de perfil en
              cualquier paso, sin volver a subir. */}
          <div className="mb-8 flex justify-center">
            <ProfileSwitch label="Perfil" />
          </div>

          <div data-stack className="grid gap-[22px] md:grid-cols-3">
            {steps[shownProfile].map((step, i) => (
              <article
                key={`${shownProfile}-${step.title}`}
                data-step
                className="flex flex-col gap-[18px] rounded-lg bg-cream px-[22px] pb-7 pt-[22px]"
              >
                <div data-step-art>
                  <Illustration id={step.illustration} variant="small" />
                </div>

                <span
                  aria-hidden
                  className="font-display text-[clamp(3.4rem,6vw,5.2rem)] font-black leading-[0.75] tracking-[-0.05em] text-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="sr-only">Paso {i + 1} de 3.</span>

                <div className="mt-auto">
                  <h3 className="text-[1.45rem] text-secondary">{step.title}</h3>
                  <p className="mt-2 text-[0.98rem] text-secondary/80">{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
