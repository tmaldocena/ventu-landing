import { useEffect, useState } from "react";
import { illustrations } from "@/data/illustrations";
import { loadInlineArt, peekInlineArt } from "@/lib/inlineSvg";
import { cn } from "@/lib/cn";
import { Illustration } from "@/components/ui/Illustration";

type Props = {
  /** Id del registro en src/data/illustrations.ts (ej. "IL-02"). */
  id: string;
  className?: string;
};

/**
 * Igual que `<Illustration variant="fill">`, pero con el SVG inline para que
 * GSAP pueda animar sus trazos.
 *
 * Mientras el markup no llegó (o si el archivo no existe) muestra la versión
 * `<img>`, que ya sabe caer al placeholder rayado. Cuando está en caché se
 * renderiza inline desde el primer frame, así el cambio de perfil no espera.
 */
export function InlineIllustration({ id, className }: Props) {
  const src = illustrations[id]?.src;
  const [markup, setMarkup] = useState<string | null>(() =>
    src ? (peekInlineArt(src)?.markup ?? null) : null,
  );

  useEffect(() => {
    if (!src) {
      setMarkup(null);
      return;
    }

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
        // Sin archivo (o inválido): se queda el `<img>`, que cae al placeholder.
      });

    return () => {
      alive = false;
    };
  }, [src]);

  if (!markup) return <Illustration id={id} variant="fill" className={className} />;

  return (
    <div
      data-inline-art
      aria-hidden
      className={cn("absolute inset-0 overflow-hidden", className)}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
