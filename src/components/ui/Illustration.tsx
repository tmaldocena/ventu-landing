import { useState } from "react";
import { illustrations } from "@/data/illustrations";
import { cn } from "@/lib/cn";

type Props = {
  /** Id del registro en src/data/illustrations.ts (ej. "IL-02"). */
  id: string;
  variant?: "default" | "wide" | "small" | "square" | "fill";
  /** "onPrimary" para placeholders sobre fondo terracota. */
  tone?: "light" | "onPrimary";
  className?: string;
};

const aspect: Record<NonNullable<Props["variant"]>, string> = {
  default: "aspect-[4/3] rounded-lg p-5",
  wide: "aspect-[16/10] rounded-lg p-5",
  small: "aspect-[16/10] rounded-md p-3",
  square: "aspect-square rounded-lg p-5",
  // Fondo a sangre: cubre el contenedor posicionado que lo envuelve.
  fill: "rounded-none border-0 p-6",
};

/**
 * Muestra la ilustración registrada con ese id. Si todavía no tiene `src` —o
 * el archivo no existe—, dibuja un placeholder rayado con la descripción de
 * qué va ahí, así se pueden subir los SVG de a uno sin dejar imágenes rotas.
 *
 * `variant="fill"` la usa como fondo a sangre (cubre el contenedor y es
 * decorativa: sin alt ni lectura por lectores de pantalla).
 */
export function Illustration({ id, variant = "default", tone = "light", className }: Props) {
  const spec = illustrations[id];
  const fill = variant === "fill";
  // Guardamos qué `src` falló (no un booleano) para que al cambiar de id se
  // vuelva a intentar con el archivo nuevo.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = spec?.src;
  const showImage = Boolean(src) && failedSrc !== src;

  if (showImage && src) {
    return (
      <img
        src={src}
        alt={fill ? "" : (spec.alt ?? spec.label)}
        aria-hidden={fill || undefined}
        loading={fill ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailedSrc(src)}
        className={cn(
          fill ? "absolute inset-0 h-full w-full object-cover" : "h-auto w-full object-contain",
          className,
        )}
      />
    );
  }

  return (
    <div
      role={fill ? undefined : "img"}
      aria-label={fill ? undefined : `Espacio para ilustración ${id}: ${spec?.label ?? ""}`}
      aria-hidden={fill || undefined}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-1.5 border-2 border-dashed text-center",
        // `cn` no resuelve conflictos: el posicionamiento se elige acá y no
        // como clase base, si no `relative` le gana a `absolute`.
        fill ? "absolute inset-0" : "relative",
        aspect[variant],
        tone === "light"
          ? "bg-placeholder border-accent text-secondary"
          : "border-white/55 bg-white/15 text-white",
        fill && "opacity-45",
        className,
      )}
    >
      <b
        className={cn(
          "rounded-full px-2.5 py-[3px] text-[0.72rem] tracking-[0.14em]",
          tone === "light" ? "bg-secondary text-cream" : "bg-white text-primary-600",
        )}
      >
        {id}
      </b>
      <span className={cn("max-w-[22em] opacity-85", variant === "small" ? "text-[0.85rem]" : "text-[0.95rem]")}>
        {spec?.label}
      </span>
    </div>
  );
}
