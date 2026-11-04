import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Botón flotante para volver al inicio.
 *
 * Aparece después del hero y se aparta cuando el cierre o el footer están a
 * la vista, para no tapar la ilustración del card ni los créditos. Al usarlo
 * el foco pasa al logo del nav: el botón se oculta al llegar arriba y así el
 * teclado no queda en un elemento invisible.
 */
export function BackToTop() {
  const [scrolled, setScrolled] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > window.innerHeight * 0.9);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const targets = [
      document.querySelector("#unite [data-reveal]"),
      document.querySelector("footer"),
    ].filter((el): el is Element => Boolean(el));

    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen.add(entry.target);
          else seen.delete(entry.target);
        }
        setBlocked(seen.size > 0);
      },
      { rootMargin: "0px 0px -5% 0px" },
    );

    targets.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      io.disconnect();
    };
  }, []);

  const visible = scrolled && !blocked;

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    // Al llegar el botón se oculta: el foco tiene que quedar en algo visible.
    document
      .querySelector<HTMLAnchorElement>('header a[aria-label="Ventu, inicio"]')
      ?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      aria-label="Volver al inicio"
      aria-hidden={!visible || undefined}
      tabIndex={visible ? 0 : -1}
      onClick={toTop}
      className={cn(
        "group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 grid size-12 cursor-pointer place-items-center rounded-full border border-secondary/10 bg-cream/90 text-secondary shadow-lift backdrop-blur-md sm:right-5",
        "transition-[opacity,transform,background-color,border-color,box-shadow] duration-300 ease-out",
        "hover:-translate-y-0.5 hover:border-secondary/20 hover:shadow-[0_16px_34px_-14px_rgb(15_39_66/0.5)]",
        "active:translate-y-0 active:scale-95",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="size-5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        <path
          d="M12 19V5m0 0-6 6m6-6 6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
