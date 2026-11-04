import { useRef } from "react";
import { features } from "@/data/content";
import { useReveals } from "@/hooks/useReveals";
import { Container } from "@/components/ui/Container";
import { Video } from "@/components/ui/Video";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

export function Features() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  return (
    <section id="features" ref={ref} className="bg-gradient-to-b from-[#C26C45] to-primary pb-24 pt-10">
      <Container>
        <SectionHeading
          eyebrow="Funciones"
          title={
            <>
              Todo lo que necesitás, <br />
              sin vueltas.
            </>
          }
          className="mb-10"
          tone="dark"
        />

        {features.map((f, i) => (
          <article
            key={f.tag}
            data-reveal
            className="grid items-center gap-7 py-9 md:grid-cols-2 md:gap-16"
          >
            <div className="min-w-0">
              <span className="mb-4 inline-block rounded-full bg-primary-soft px-3 py-[5px] text-[0.78rem] font-bold uppercase tracking-[0.08em] text-primary-600">
                {f.tag}
              </span>
              <h3 className="mb-3.5 text-[clamp(1.7rem,3.2vw,2.3rem)] text-cream">{f.title}</h3>
              <p className="max-w-[30em] text-cream">{f.text}</p>
            </div>
            <div className={cn("grid min-w-0 gap-3.5", i % 2 === 1 && "md:order-first")}>

              <Video id={f.screenshot} variant="wide" className={cn("max-w-[30rem] w-full  h-[40rem] object-cover")} />
            </div>
          </article>
        ))}
      </Container>
    </section>
  );
}
