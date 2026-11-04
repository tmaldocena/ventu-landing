import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  tone?: "light" | "dark";
  className?: string;
  children?: ReactNode;
};

/** Encabezado centrado de sección: eyebrow + título + bajada (+ contenido extra). */
export function SectionHeading({ eyebrow, title, lead, tone = "light", className, children }: Props) {
  const dark = tone === "dark";
  return (
    <div data-reveal className={cn("text-center", className)}>
      <span
        className={cn(
          "mb-3.5 inline-block text-[0.8rem] font-bold uppercase tracking-[0.12em]",
          dark ? "text-[#f0a788]" : "text-primary",
        )}
      >
        {eyebrow}
      </span>
      <h2 className={cn("text-[clamp(2rem,4.2vw,3.1rem)]", dark && "text-cream")}>{title}</h2>
      {lead && (
        <p
          className={cn(
            "mx-auto mt-4 max-w-[34em] text-[1.2rem]",
            dark ? "text-cream/75" : "text-secondary/80",
          )}
        >
          {lead}
        </p>
      )}
      {children}
    </div>
  );
}
