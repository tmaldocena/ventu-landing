import { useMemo, type CSSProperties } from "react";

const rnd = (min: number, max: number) => min + Math.random() * (max - min);

type Dot = { id: number; style: CSSProperties };

function makeStars(count: number): Dot[] {
  return Array.from({ length: count }, (_, id) => {
    const size = rnd(1, 2.6);
    return {
      id,
      style: {
        left: `${rnd(0, 100)}%`,
        top: `${rnd(0, 78)}%`,
        width: size,
        height: size,
        "--t": `${rnd(3, 7)}s`,
        "--d": `${rnd(0, 6)}s`,
      } as CSSProperties,
    };
  });
}

function makeFireflies(count: number): Dot[] {
  return Array.from({ length: count }, (_, id) => {
    const size = rnd(3, 7);
    return {
      id,
      style: {
        left: `${rnd(2, 98)}%`,
        top: `${rnd(8, 92)}%`,
        width: size,
        height: size,
        "--dx": `${rnd(-60, 60)}px`,
        "--dy": `${rnd(-50, 50)}px`,
        "--drift": `${rnd(12, 24)}s`,
        "--g": `${rnd(2.2, 4.5)}s`,
        "--d": `${rnd(-10, 0)}s`, // delay negativo: arrancan "a mitad" de la animación
      } as CSSProperties,
    };
  });
}

/**
 * Cielo nocturno: estrellas que titilan + luciérnagas que derivan.
 * Las dos capas se desplazan con --mx / --my (ver useCursorParallax).
 */
export function NightSky() {
  const { stars, flies } = useMemo(() => {
    const small = window.innerWidth < 700;
    return {
      stars: makeStars(small ? 45 : 80),
      flies: makeFireflies(small ? 12 : 26),
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {/* Wrapper externo: lo mueve GSAP con el scroll. El interno conserva el
          translate del cursor (--mx / --my) para que no se pisen. */}
      <div data-sky-layer="stars" className="absolute inset-0">
        <div
          className="absolute -inset-8 transition-transform duration-[350ms] ease-out"
          style={{ transform: "translate(calc(var(--mx, 0) * -6px), calc(var(--my, 0) * -6px))" }}
        >
          {stars.map((s) => (
            <span
              key={s.id}
              style={s.style}
              className="absolute animate-twinkle rounded-full bg-white opacity-20 motion-reduce:animate-none motion-reduce:opacity-60"
            />
          ))}
        </div>
      </div>
      <div data-sky-layer="flies" className="absolute inset-0">
        <div
          className="absolute -inset-8 transition-transform duration-[350ms] ease-out"
          style={{ transform: "translate(calc(var(--mx, 0) * -16px), calc(var(--my, 0) * -12px))" }}
        >
          {flies.map((f) => (
            <span
              key={f.id}
              style={f.style}
              className="absolute animate-fly rounded-full bg-glow shadow-[0_0_8px_2px_rgb(255_201_60/0.65),0_0_22px_6px_rgb(255_201_60/0.25)] motion-reduce:animate-none motion-reduce:opacity-85"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
