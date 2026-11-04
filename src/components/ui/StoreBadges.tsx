import { appLinks } from "@/data/content";
import { cn } from "@/lib/cn";

/**
 * Badges de App Store / Google Play para el cierre.
 *
 * Mientras `appLinks.status` sea "soon" se muestran como “Próximamente” y no
 * son links. Al pasar a "live" y completar las URLs se vuelven enlaces
 * externos sin tener que tocar este componente.
 */

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
      <path d="M5 4.1v15.8c0 .83.92 1.33 1.6.87l12.2-7.9a1.04 1.04 0 0 0 0-1.74L6.6 3.23A1.04 1.04 0 0 0 5 4.1Z" />
    </svg>
  );
}

const stores = [
  { key: "appStore", name: "App Store", icon: <AppleIcon /> },
  { key: "playStore", name: "Google Play", icon: <PlayIcon /> },
] as const;

export function StoreBadges({ className }: { className?: string }) {
  const live = appLinks.status === "live";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2.5 md:justify-start",
        className,
      )}
    >
      {stores.map((store) => {
        const href = live ? appLinks[store.key] : undefined;

        const content = (
          <>
            <span className="text-white/90">{store.icon}</span>
            <span className="flex flex-col items-start leading-none">
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/60">
                {href ? "Descargar en" : "Próximamente"}
              </span>
              <span className="mt-1 text-[0.95rem] font-bold text-white">{store.name}</span>
            </span>
          </>
        );

        const base =
          "inline-flex items-center gap-2.5 rounded-md border px-3.5 py-2.5 text-left";

        return href ? (
          <a
            key={store.key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              base,
              "border-white/30 bg-white/10 transition-[background-color,border-color,transform] duration-200",
              "hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20",
              "focus-visible:outline-cream motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
          >
            {content}
          </a>
        ) : (
          <span key={store.key} className={cn(base, "border-white/20 bg-white/5")}>
            {content}
          </span>
        );
      })}
    </div>
  );
}
