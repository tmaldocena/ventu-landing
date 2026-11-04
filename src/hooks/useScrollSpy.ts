import { useEffect, useState } from "react";

/**
 * Devuelve el id de la sección que cruza la línea de lectura.
 *
 * Se usa para el subrayado activo del nav y para la lista de tareas de la
 * guía. La línea se mide desde el borde superior del viewport (`offset`), así
 * que el estado cambia justo cuando la sección queda debajo del header fijo.
 *
 * No hay observer por sección: un único listener de scroll con `rAF` evita
 * trabajo repetido y contempla bien los huecos entre secciones. En los huecos
 * devuelve `null`, que es lo que queremos sobre el hero y el cierre.
 */
export function useScrollSpy(ids: string[], offset = 110) {
  const key = ids.join("|");
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) {
      setActive(null);
      return;
    }

    let raf = 0;

    const compute = () => {
      raf = 0;
      let current: string | null = null;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          current = el.id;
          break;
        }
      }

      setActive(current);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key, offset]);

  return active;
}
