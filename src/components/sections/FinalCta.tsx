import { useRef } from "react";
import { finalCta } from "@/data/content";
import { useReveals } from "@/hooks/useReveals";
import { Container } from "@/components/ui/Container";
import { Illustration } from "@/components/ui/Illustration";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { FinalCtaBackdrop } from "@/components/sections/FinalCtaBackdrop";

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  return (
    <section id="unite" ref={ref} className="relative isolate overflow-hidden pb-28 pt-24">
      <FinalCtaBackdrop />

      <Container>
        <div
          data-reveal
          data-on-primary
          className="relative mx-auto max-w-[1000px] overflow-hidden rounded-lg bg-primary px-7 py-12 text-white sm:px-10 md:px-14 md:py-[72px]"
        >
          {/* Halo detrás de la ilustración: le da profundidad al bloque sin
              competir con el texto. Se recorta con el overflow del card. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-28 top-1/2 hidden aspect-square w-[560px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_201_60/0.26),rgb(255_201_60/0)_68%)] md:block"
          />

          <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-12">
            <div className="text-center md:text-left">


              <h2 className="mx-auto mb-4 max-w-[14em] text-[clamp(2rem,4.2vw,3.1rem)] text-white md:mx-0">
                {finalCta.title}
              </h2>
              <p className="mx-auto mb-8 max-w-[32em] text-white/90 md:mx-0">{finalCta.text}</p>

              <StoreBadges />
            </div>

            {/* La ilustración de Ventu con el móvil entra como protagonista de
                la columna derecha. En mobile se apila debajo del texto. */}
            <div className="relative mx-auto w-full max-w-[420px]">
              <Illustration
                id={finalCta.illustration}
                variant="square"
                tone="onPrimary"
                className="relative z-10"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
