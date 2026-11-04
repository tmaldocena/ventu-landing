import CursorFollower from "@/components/Follow-Ventu/CursorFollower";
import { mascotFrames } from "@/components/Follow-Ventu/frames";

/**
 * ─────────────────────────────────────────────────────────────
 *  VENTU
 *
 *  Mascota con seguimiento de cursor: según la posición del puntero
 *  respecto del centro, cambia entre nueve frames (una mirada por
 *  dirección) con histéresis para no parpadear entre diagonales.
 *
 *  El wrapper exterior hace el parallax de scroll, el siguiente la
 *  entrada del hero y el interior flota (animate-float). El componente
 *  mueve los frames por dentro, así no se pisan los transforms.
 *  En touch y con prefers-reduced-motion queda mirando al centro.
 *
 *  El tamaño (540px) replica el ancho que tenía la imagen anterior;
 *  en mobile se achica al ancho del contenedor (84vw).
 * ─────────────────────────────────────────────────────────────
 */

/** Config estable: si cambia la identidad en cada render, el follower se remonta. */
const cursorConfig = { frames: mascotFrames };

export function VentuMascot() {
  return (
    // Tres capas: parallax de scroll (GSAP) → entrada del hero (GSAP) → flotado (CSS).
    <div data-mascot-parallax className="relative z-[3] -mb-2 w-[min(540px,84vw)] lg:-mb-6">
      <div data-hero="mascot">
        <div className="animate-float motion-reduce:animate-none">
          <div className="drop-shadow-[0_20px_40px_rgb(0_0_0/0.35)]">
            <CursorFollower
              config={cursorConfig}
              size={540}
              label="Ventu, la luciérnaga guía"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
