import { useRef } from "react";
import { hero, heroChips } from "@/data/content";
import { useProfile } from "@/context/ProfileContext";
import { useCursorParallax } from "@/hooks/useCursorParallax";
import { gsap, useGSAP } from "@/lib/gsap";
import { NightSky } from "@/components/hero/NightSky";
import { VentuMascot } from "@/components/hero/VentuMascot";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

/** Posición de cada chip alrededor de Ventu. En mobile flotan a los costados del escenario. */
const chipPosition = [
  { className: "left-0 top-0 lg:left-[1%] lg:top-[14%]", delay: "-1s" },
  { className: "right-0 top-0 lg:right-[1%] lg:top-[8%]", delay: "-3s" },
  { className: "left-0 bottom-[12%] lg:left-[4%] lg:bottom-[30%]", delay: "-5s" },
  { className: "right-0 bottom-[2%] lg:right-[3%] lg:bottom-[24%]", delay: "-2s" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { setProfile } = useProfile();
  useCursorParallax(ref);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Entrada: texto, botones, mascota y chips. Las animaciones ambientales
      // (float, glow) siguen en CSS y no tocan las mismas propiedades.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(q("[data-hero='badge']"), { autoAlpha: 0, y: 16, duration: 0.5 })
          .from(q("[data-hero='title']"), { autoAlpha: 0, y: 24, duration: 0.8 }, "-=0.25")
          .from(q("[data-hero='lead']"), { autoAlpha: 0, y: 18, duration: 0.6 }, "-=0.5")
          .from(q("[data-hero='actions']"), { autoAlpha: 0, y: 18, duration: 0.6 }, "-=0.45")
          .from(q("[data-hero='launch']"), { autoAlpha: 0, y: 14, duration: 0.5 }, "-=0.5")
          .from(q("[data-hero='mascot']"), { autoAlpha: 0, y: 40, duration: 1 }, "-=0.55")
          .from(
            q("[data-hero='chip']"),
            { autoAlpha: 0, filter: "blur(6px)", duration: 0.6, stagger: 0.08, clearProps: "filter" },
            "-=0.8",
          );
      });

      // Parallax de scroll: solo desktop. Cada capa tiene su propio wrapper
      // para no pisar el translate del cursor (--mx / --my).
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const base = { trigger: root, start: "top top", end: "bottom top", scrub: true } as const;
        gsap.to(q("[data-sky-layer='stars']"), { y: -30, ease: "none", scrollTrigger: { ...base } });
        gsap.to(q("[data-sky-layer='flies']"), { y: -55, ease: "none", scrollTrigger: { ...base } });
        gsap.to(q("[data-mascot-parallax]"), { y: -40, ease: "none", scrollTrigger: { ...base } });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      id="hero"
      ref={ref}
      className="relative overflow-hidden bg-night-sky pt-[112px] text-center text-cream"
    >
      <NightSky />

      {/* Sin degradé a crema: la sección siguiente es nocturna, así que la
          noche del hero sigue de corrido. `bg-night-sky` termina en #1b3c5e,
          el mismo color con el que arranca el empalme de cómo funciona. */}
      <Container className="relative z-[3]">
        <span className="mb-6 inline-flex items-center gap-2  px-4 py-2 text-[0.88rem] font-semibold">
          <img src="/ventu-logotipo-claro.svg" alt="Ventu" className="h-12 inline-block align-middle" />
        </span>

        <h1 data-hero="title" className="mx-auto max-w-[11em] text-[clamp(2.8rem,8vw,6.2rem)]">
          {hero.titleStart}{" "}
          <em className="relative whitespace-nowrap text-glow not-italic">
            {hero.titleAccent}
          </em>
        </h1>

        <p data-hero="lead" className="mx-auto mb-7 mt-6 max-w-[30em] text-[1.2rem] text-cream/80">
          {hero.lead}
        </p>

        <div data-hero="actions" className="flex flex-wrap justify-center gap-3.5">
          <Button href="#como" onClick={() => setProfile("vecino")}>
            Soy vecino
          </Button>
          <Button href="#como" variant="ghost-light" onClick={() => setProfile("emprendedor")}>
            Soy emprendedor
          </Button>
        </div>

        <p data-hero="launch" className="mt-4 text-[0.95rem] text-cream/65">
          <a
            href="#unite"
            className="font-semibold text-cream underline decoration-cream/35 underline-offset-4 transition-colors hover:text-glow"
          >
            {hero.launchNote}
          </a>
        </p>

        {/* Escenario: Ventu al centro, funciones como luciérnagas */}
        <div className="relative mx-auto mt-6 flex max-w-[1040px] flex-col items-center lg:flex-row lg:items-end lg:justify-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto aspect-square w-[min(640px,90vw)] animate-breathe rounded-full bg-[radial-gradient(circle,rgb(255_201_60/0.22),rgb(255_201_60/0)_65%)] motion-reduce:animate-none lg:bottom-[6%]"
          />

          <div className="absolute inset-0 z-[4] lg:contents">
            {heroChips.map((chip, i) => (
              <div
                key={chip.title}
                data-hero="chip"
                style={{ animationDelay: chipPosition[i].delay }}
                className={cn(
                  "group absolute z-[4] flex max-w-[48%] items-center gap-1.5 rounded-full border border-cream/20 bg-secondary/75 py-2 pl-2 pr-2.5 text-left text-[0.8rem] font-semibold leading-tight text-cream shadow-[0_0_0_0_rgb(255_201_60/0)] backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:border-glow/45 hover:bg-secondary/85 hover:shadow-[0_0_24px_rgb(255_201_60/0.32)] lg:max-w-none lg:animate-float-slow lg:gap-3 lg:bg-cream/10 lg:py-2.5 lg:pl-3.5 lg:pr-5 lg:text-[0.94rem] lg:hover:bg-cream/15 lg:hover:shadow-[0_0_28px_rgb(255_201_60/0.35)] motion-reduce:animate-none motion-reduce:transition-none",
                  chipPosition[i].className,
                )}
              >
                <span className="size-2.5 flex-none animate-glow rounded-full bg-glow shadow-[0_0_12px_3px_rgb(255_201_60/0.6)] transition-[box-shadow,scale] duration-300 ease-out group-hover:scale-110 group-hover:shadow-[0_0_20px_5px_rgb(255_201_60/0.85)] motion-reduce:animate-none motion-reduce:transition-none lg:size-3.5" />
                <span>
                  {chip.title}
                  <small className="block text-[0.7rem] font-normal text-cream/65 transition-colors duration-300 group-hover:text-cream/85 motion-reduce:transition-none lg:text-[0.8rem]">
                    {chip.subtitle}
                  </small>
                </span>
              </div>
            ))}
          </div>

          <VentuMascot />
        </div>
      </Container>
    </section>
  );
}
