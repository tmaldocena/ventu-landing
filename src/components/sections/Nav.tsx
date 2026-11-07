import { useEffect, useRef, useState } from "react";
import { appCta, appPrimaryLink, navLinks } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const NAV_HEIGHT = 68;
/** Alto del degradado de amanecer al pie del hero: cuando el nav entra ahí, ya no hay fondo oscuro. */
const SUNRISE_HEIGHT = 150;
const NAV_IDS = navLinks.map((link) => link.href.slice(1));

/**
 * Nav fijo que flota sobre el hero: mientras hay cielo nocturno detrás se ve
 * transparente con texto crema; al salir del hero pasa a crema/blur con texto
 * oscuro para seguir legible sobre las secciones claras.
 */
export function Nav() {
  const [overHero, setOverHero] = useState(true);
  const activeId = useScrollSpy(NAV_IDS);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const update = () => {
      setOverHero(hero.getBoundingClientRect().bottom > NAV_HEIGHT + SUNRISE_HEIGHT);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Esconder al bajar, mostrar al subir. El cambio transparente → sólido sigue
  // a cargo del estado `overHero`; acá solo se mueve el header con transform.
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let hidden = false;

        const show = () => {
          if (!hidden) return;
          hidden = false;
          gsap.to(el, { yPercent: 0, duration: 0.3, ease: "power2.out", overwrite: true });
        };
        const hide = () => {
          if (hidden) return;
          hidden = true;
          gsap.to(el, { yPercent: -110, duration: 0.35, ease: "power2.out", overwrite: true });
        };

        const st = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            if (self.scroll() < 80) return show();
            if (self.direction === 1) hide();
            else show();
          },
        });

        el.addEventListener("focusin", show);

        return () => {
          st.kill();
          el.removeEventListener("focusin", show);
          gsap.set(el, { yPercent: 0, clearProps: "transform" });
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <header
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 motion-reduce:transition-none",
        overHero
          ? "border-transparent text-cream"
          : "border-secondary/10 bg-cream/90 text-secondary backdrop-blur-md",
      )}
    >
      <Container className="flex h-[68px] items-center justify-between">
        <a href="#top" aria-label="Ventu, inicio" className="flex items-center no-underline">
          {/* Dos variantes del mismo logo: azul sobre el nav sólido y crema
              sobre el hero nocturno. Se cruzan con el mismo timing que el
              fondo del header, sin saltos ni recarga. */}
          <span className="relative block h-9 w-[106px]">
            <img
              src="/ventu-logotipo.svg"
              alt=""
              width={255}
              height={87}
              className={cn(
                "absolute inset-0 h-full w-full object-contain transition-opacity duration-300 motion-reduce:transition-none",
                overHero ? "opacity-0" : "opacity-100",
              )}
            />
            <img
              src="/ventu-logotipo-claro.svg"
              alt=""
              width={255}
              height={87}
              className={cn(
                "absolute inset-0 h-full w-full object-contain transition-opacity duration-300 motion-reduce:transition-none",
                overHero ? "opacity-100" : "opacity-0",
              )}
            />
          </span>
        </a>
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex gap-7">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={activeId === l.href.slice(1) ? "location" : undefined}
                  className={cn(
                    // Subrayado que crece desde la izquierda en hover y queda
                    // fijo en la sección activa. `bg-current` hereda el color
                    // del link, así funciona sobre el hero y sobre el crema.
                    "relative text-[0.95rem] font-medium no-underline transition-colors duration-200",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-200 after:ease-out",
                    "hover:after:scale-x-100 [&[aria-current=location]]:after:scale-x-100 motion-reduce:after:transition-none",
                    overHero ? "hover:text-glow" : "hover:text-primary",
                  )}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          href="https://ventu-one.vercel.app"
          size="sm"
          target={appPrimaryLink.startsWith("http") ? "_blank" : undefined}
          rel={appPrimaryLink.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {appCta}
        </Button>
      </Container>
    </header>
  );
}
