import { useEffect, useRef, useState } from "react";
import { illustrations } from "@/data/illustrations";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

type Props = {
  /** Id del registro en src/data/illustrations.ts (ej. "CAPTURA-01"). */
  id: string;
  variant?: "default" | "wide" | "small" | "square" | "fill";
  /** "onPrimary" para placeholders sobre fondo terracota. */
  tone?: "light" | "onPrimary";
  className?: string;
  /** Ajuste visual del video dentro del contenedor. Por defecto "cover". */
  fit?: "cover" | "contain";
  /** Si debe reproducirse automáticamente. Por defecto true (silenciado). */
  autoPlay?: boolean;
  /** Si debe reproducirse en bucle. Por defecto true. */
  loop?: boolean;
  /** Si debe estar silenciado. Requerido para autoPlay en navegadores modernos. */
  muted?: boolean;
  /** Evita que iOS abra el reproductor en pantalla completa al reproducir. */
  playsInline?: boolean;
  /** Si debe mostrar los controles nativos de reproducción. */
  controls?: boolean;
  /** Imagen de portada o poster opcional. */
  poster?: string;
  /** Fuente de video directa (alternativa opcional a usar src de illustrations.ts). */
  src?: string;
};

const placeholderAspect: Record<NonNullable<Props["variant"]>, string> = {
  default: "aspect-[4/3] rounded-lg p-5",
  wide: "aspect-[16/10] rounded-lg p-5",
  small: "aspect-[16/10] rounded-md p-3",
  square: "aspect-square rounded-lg p-5",
  // Fondo a sangre: cubre el contenedor posicionado que lo envuelve.
  fill: "rounded-none border-0 p-6",
};

const mediaAspect: Record<NonNullable<Props["variant"]>, string> = {
  default: "aspect-[4/3] rounded-lg",
  wide: "aspect-[16/10] rounded-lg",
  small: "aspect-[16/10] rounded-md",
  square: "aspect-square rounded-lg",
  fill: "rounded-none",
};

/**
 * Muestra el video registrado con ese id (ej. capturas o mockups de pantalla).
 * Si todavía no tiene `src` —o el archivo no existe o falla al cargar—, dibuja
 * un placeholder rayado con la descripción de qué va ahí, igual que `Illustration`.
 *
 * `variant="fill"` lo usa como fondo a sangre (cubre el contenedor).
 */
export function Video({
  id,
  variant = "default",
  tone = "light",
  className,
  fit = "cover",
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  poster: propPoster,
  src: propSrc,
}: Props) {
  const spec = illustrations[id];
  const fill = variant === "fill";
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const src = propSrc ?? spec?.src;
  const poster = propPoster ?? spec?.poster;
  const showVideo = Boolean(src) && failedSrc !== src;

  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const shouldAutoPlay = autoPlay && !prefersReducedMotion;
  const videoRef = useRef<HTMLVideoElement>(null);

  // Asegura que la propiedad muted del DOM esté activa para no bloquear el autoplay
  useEffect(() => {
    if (videoRef.current && muted) {
      videoRef.current.muted = true;
    }
  }, [muted, src]);

  // Intenta reproducir de forma segura cuando corresponde
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo || !shouldAutoPlay) return;

    video.play().catch(() => {
      // Ignora rechazos de política de autoplay del navegador
    });
  }, [showVideo, shouldAutoPlay, src]);

  if (showVideo && src) {
    return (
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={shouldAutoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        preload="metadata"
        aria-label={fill ? undefined : (spec?.alt ?? spec?.label)}
        aria-hidden={fill || undefined}
        onError={() => setFailedSrc(src)}
        className={cn(
          fill
            ? "absolute inset-0 h-full w-full object-cover"
            : cn(
              "w-full overflow-hidden bg-surface-muted/30",
              fit === "cover" ? "object-cover" : "object-contain",
              mediaAspect[variant],
            ),
          className,
        )}
      >
        <p className="sr-only">Tu navegador no soporta la reproducción de este video.</p>
      </video>
    );
  }

  return (
    <div
      role={fill ? undefined : "img"}
      aria-label={fill ? undefined : `Espacio para video ${id}: ${spec?.label ?? ""}`}
      aria-hidden={fill || undefined}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-1.5 border-2 border-dashed text-center",
        // `cn` no resuelve conflictos: el posicionamiento se elige acá y no
        // como clase base, si no `relative` le gana a `absolute`.
        fill ? "absolute inset-0" : "relative",
        placeholderAspect[variant],
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
      <span
        className={cn(
          "max-w-[22em] opacity-85",
          variant === "small" ? "text-[0.85rem]" : "text-[0.95rem]",
        )}
      >
        {spec?.label}
      </span>
    </div>
  );
}
