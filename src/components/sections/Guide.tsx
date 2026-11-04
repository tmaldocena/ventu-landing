import { useRef } from "react";
import { guide } from "@/data/content";
import { useProfile } from "@/context/ProfileContext";
import { useReveals } from "@/hooks/useReveals";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Illustration } from "@/components/ui/Illustration";
import { ProfileSwitch } from "@/components/ui/ProfileSwitch";
import { SectionHeading } from "@/components/ui/SectionHeading";

const profileTitle = { vecino: "Vecino", emprendedor: "Emprendedor" } as const;

/** Manual de usuario: tareas por perfil, con anclas (#v-… / #e-…) compartibles. */
export function Guide() {
  const { profile } = useProfile();
  const tasks = guide[profile];
  const activeTask = useScrollSpy(
    tasks.map((task) => task.id),
    120,
  );
  const ref = useRef<HTMLElement>(null);

  useReveals(ref, [profile]);

  return (
    <section id="guia" ref={ref} className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Guía de uso"
          title="Cómo hacer cada cosa."
          lead="El manual de Ventu, por tarea. Elegí tu perfil y andá directo a lo que necesitás."
          className="mb-10"
        >
          <ProfileSwitch label="Perfil de la guía" className="mt-6" />
        </SectionHeading>

        <div className="grid items-start gap-12 lg:grid-cols-[240px_1fr]">
          <nav
            aria-label={`Tareas para ${profile === "vecino" ? "vecinos" : "emprendedores"}`}
            className="flex flex-wrap gap-2 lg:sticky lg:top-24 lg:flex-col lg:gap-1"
          >
            <p className="mb-2 w-full text-[0.78rem] font-bold uppercase tracking-[0.12em] text-secondary/50">
              {profileTitle[profile]}
            </p>
            {tasks.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                aria-current={activeTask === t.id ? "location" : undefined}
                className={cn(
                  "rounded-sm px-3.5 py-2.5 text-[0.96rem] font-medium no-underline transition-colors duration-150",
                  activeTask === t.id
                    ? "bg-secondary text-cream"
                    : "bg-surface lg:bg-transparent lg:hover:bg-surface",
                )}
              >
                {t.title}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-7">
            {tasks.map((task) => (
              <article
                key={task.id}
                id={task.id}
                data-reveal="fade"
                className="grid gap-7 rounded-lg bg-surface p-[30px] items-center shadow-soft md:grid-cols-[1fr_280px]"
              >
                <div>
                  <h3 className="mb-1.5 text-[1.45rem]">{task.title}</h3>
                  <p className="mb-4 text-secondary/70">{task.intro}</p>
                  <ol className="flex flex-col gap-3">
                    {task.steps.map((s, i) => (
                      <li key={s} className="flex gap-3 text-[0.98rem]">
                        <span className="mt-px grid size-[26px] flex-none place-items-center rounded-full bg-accent-soft text-[0.82rem] font-bold">
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  {task.tip && (
                    <p className="mt-4 rounded-sm bg-primary-soft px-3.5 py-3 text-[0.92rem]">
                      💡 {task.tip}
                    </p>
                  )}
                </div>
                <Illustration id={task.illustration} variant="square" className="rounded" />
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
