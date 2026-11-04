import { useRef } from "react";
import { compare } from "@/data/content";
import { useReveals } from "@/hooks/useReveals";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Compare() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  return (
    <section id="redes" ref={ref} className="bg-secondary py-24 text-cream">
      <Container>
        <SectionHeading
          tone="dark"
          eyebrow={compare.eyebrow}
          title={compare.title}
          lead={compare.lead}
        />

        <div
          data-reveal
          className="mt-12 overflow-x-auto rounded-lg border border-cream/15 bg-white/5"
        >
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="text-left text-[0.9rem] font-semibold uppercase tracking-[0.06em]">
                <th scope="col" className="px-6 py-[18px]">
                  <span className="sr-only">Característica</span>
                </th>
                <th scope="col" className="px-6 py-[18px] text-[#f0a788]">Ventu</th>
                <th scope="col" className="px-6 py-[18px] text-cream/65">{compare.themLabel}</th>
              </tr>
            </thead>
            <tbody>
              {compare.rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-t border-cream/10 transition-colors duration-150 hover:bg-white/[0.04]"
                >
                  <th scope="row" className="px-6 py-[18px] text-left font-normal">
                    {row.label}
                  </th>
                  <td className="bg-primary/15 px-6 py-[18px] font-semibold text-[#f0a788]">
                    ✓ {row.us}
                  </td>
                  <td className="px-6 py-[18px] opacity-60">{row.them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
