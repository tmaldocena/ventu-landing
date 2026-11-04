import { useEffect, useRef, useState } from "react";
import { illustrations } from "@/data/illustrations";
import { loadInlineArt, peekInlineArt } from "@/lib/inlineSvg";
import { useMapBackdrop } from "@/hooks/useMapBackdrop";

const src = illustrations["BG-01"]?.src;

/**
 * Fondo del cierre: un mapa de barrio en linework que se dibuja al entrar y
 * después deriva muy despacio. Vive detrás del `Container` y se recorta con el
 * `overflow-hidden` de la sección.
 *
 * Si el SVG no existe o falla el fetch, quedan solo los halos: nunca hay un
 * hueco ni una imagen rota.
 */
export function FinalCtaBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const [markup, setMarkup] = useState<string | null>(() =>
    src ? (peekInlineArt(src)?.markup ?? null) : null,
  );

  useEffect(() => {
    if (!src) return;

    const cached = peekInlineArt(src);
    if (cached) {
      setMarkup(cached.markup);
      return;
    }

    let alive = true;
    loadInlineArt(src)
      .then((art) => {
        if (alive) setMarkup(art.markup);
      })
      .catch(() => {
        // Sin archivo: el fondo queda solo con los halos.
      });

    return () => {
      alive = false;
    };
  }, []);

  useMapBackdrop(ref, Boolean(markup));

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-[10%] -left-[6%] -right-[6%] -top-[10%] -z-10 overflow-hidden"
    >
      {/* Halos: dan temperatura al crema y profundidad detrás del card. */}
      <div data-wash className="absolute inset-0">
        <div className="absolute right-[6%] top-1/2 aspect-square w-[min(760px,70vw)] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_201_60/0.2),rgb(255_201_60/0)_66%)]" />
        <div className="absolute -left-[8%] top-[6%] aspect-square w-[min(520px,50vw)] rounded-full bg-[radial-gradient(circle,rgb(91_135_166/0.12),rgb(91_135_166/0)_68%)]" />
      </div>

      {markup && (
        <div
          data-map
          className="absolute inset-0 opacity-0"
          dangerouslySetInnerHTML={{ __html: markup }}
        />
      )}
    </div>
  );
}
