import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useProfile } from "@/context/ProfileContext";
import { PROFILE_LABEL, type Profile } from "@/types";
import { cn } from "@/lib/cn";

const profiles: Profile[] = ["vecino", "emprendedor"];

/**
 * Selector "Soy vecino / Soy emprendedor". Comparte estado con toda la página.
 *
 * La pill del fondo se mide sobre el botón seleccionado y se desplaza con
 * `transform`, así el cambio acompaña al crossfade del contenido. Las flechas
 * del teclado mueven la selección dentro del grupo.
 */
export function ProfileSwitch({ label, className }: { label: string; className?: string }) {
  const { profile, setProfile } = useProfile();
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<Profile, HTMLButtonElement | null>>({
    vecino: null,
    emprendedor: null,
  });
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const btn = btnRefs.current[profile];
    if (!wrap || !btn) return;

    const wr = wrap.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setPill({ x: br.left - wr.left, w: br.width });
  }, [profile]);

  // Antes del paint: la pill nace ya en su lugar, sin animación de entrada.
  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener("resize", measure);
    // Nunito carga con font-display: los anchos pueden cambiar después.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = profiles.indexOf(profile);
    let next: Profile | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = profiles[(index + 1) % profiles.length];
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = profiles[(index - 1 + profiles.length) % profiles.length];
    } else if (event.key === "Home") {
      next = profiles[0];
    } else if (event.key === "End") {
      next = profiles[profiles.length - 1];
    }

    if (!next) return;
    event.preventDefault();
    setProfile(next);
    btnRefs.current[next]?.focus();
  };

  return (
    <div
      ref={wrapRef}
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "relative inline-flex gap-1 rounded-full bg-surface p-1.5 shadow-soft",
        className,
      )}
    >
      {pill && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-1.5 left-0 rounded-full transition-[transform,width,background-color] duration-200 ease-out motion-reduce:transition-none",
            profile === "vecino" ? "bg-secondary" : "bg-primary",
          )}
          style={{ width: pill.w, transform: `translateX(${pill.x}px)` }}
        />
      )}

      {profiles.map((p) => {
        const selected = p === profile;
        return (
          <button
            key={p}
            ref={(el) => {
              btnRefs.current[p] = el;
            }}
            type="button"
            aria-pressed={selected}
            onClick={() => setProfile(p)}
            className={cn(
              "relative z-10 cursor-pointer rounded-full px-6 py-[11px] text-[0.98rem] font-semibold transition-colors duration-200",
              selected
                ? p === "vecino"
                  ? "text-cream"
                  : "text-white"
                : "text-secondary hover:bg-secondary/5",
            )}
          >
            {PROFILE_LABEL[p]}
          </button>
        );
      })}
    </div>
  );
}
