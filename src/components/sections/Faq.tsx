import { useRef } from "react";
import { faq } from "@/data/content";
import { useReveals } from "@/hooks/useReveals";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Faq() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  return (
    <section id="faq" ref={ref} className="bg-surface py-24">
      <Container>
        <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que más nos preguntan." />

        <div className="mx-auto mt-11 flex max-w-[760px] flex-col gap-3">
          {faq.map((item) => (
            <details
              key={item.q}
              data-faq
              data-reveal
              className="group rounded-md bg-cream px-6"
            >
              <summary className="flex cursor-pointer list-none justify-between gap-4 py-[18px] font-semibold transition-colors hover:text-primary after:text-[1.4rem] after:leading-none after:text-primary after:transition-transform after:duration-200 after:content-['+'] group-hover:after:scale-110 group-open:after:rotate-45 motion-reduce:transition-none motion-reduce:after:transition-none [&::-webkit-details-marker]:hidden">
                {item.q}
              </summary>
              <p className="pb-5 text-secondary/75">
                {item.todo ? (
                  <mark className="rounded bg-[#fff1b8] px-1.5 text-secondary">{item.a}</mark>
                ) : (
                  item.a
                )}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
