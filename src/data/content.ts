import type { Profile } from "@/types";

/* Todo el copy de la landing vive acá. Editá textos sin tocar componentes. */

/**
 * Estado de publicación de la app.
 *
 * Mientras `status` sea "soon" (o no haya URLs), el CTA del nav baja al cierre
 * (#unite) y los badges de tienda se muestran como “Próximamente”. Cuando la
 * app esté publicada: pasar a "live" y completar las URLs. No hay que tocar
 * ningún componente.
 */
export const appLinks: {
  status: "soon" | "live";
  web?: string;
  appStore?: string;
  playStore?: string;
} = {
  status: "soon",
  web: "https://ventu-one.vercel.app",
  appStore: "",
  playStore: "",
};

/** Primer destino disponible para el CTA principal. */
export const appPrimaryLink =
  appLinks.status === "live"
    ? appLinks.web || appLinks.appStore || appLinks.playStore || "#unite"
    : "#unite";

/** Texto del CTA principal de la app (hoy solo en el nav). */
export const appCta = "Abrir Ventu";

export const navLinks = [
  { href: "#como", label: "Cómo funciona" },
  { href: "#features", label: "Funciones" },
  { href: "#redes", label: "Sin redes" },
  { href: "#guia", label: "Guía de uso" },
  { href: "#faq", label: "Preguntas" },
];

export const hero = {
  badge: "Emprendimientos de tu zona, a la vista",
  titleStart: "Descubrí lo que hacen",
  titleAccent: "los tuyos.",
  lead: "Encontrá productos y servicios cerca tuyo. Mostrá lo que hacés sin vivir pendiente de publicar.",
  launchNote: "Muy pronto en App Store y Google Play",
};

export const heroChips = [
  { title: "Mapa interactivo", subtitle: "Cada luz es un emprendimiento" },
  { title: "Buscador con filtros", subtitle: "Directo a lo que buscás" },
  { title: "WhatsApp directo", subtitle: "Sin intermediarios" },
  { title: "Valoraciones", subtitle: "Confianza entre vecinos" },
];

export type Step = { illustration: string; title: string; text: string };

export const steps: Record<Profile, Step[]> = {
  vecino: [
    {
      illustration: "IL-02",
      title: "Explorá el mapa",
      text: "Mirá qué emprendimientos hay a tu alrededor, a pocas cuadras de donde estás.",
    },
    {
      illustration: "IL-03",
      title: "Filtrá lo que buscás",
      text: "Buscá por rubro, tipo de producto o servicio y quedate solo con lo que te interesa.",
    },
    {
      illustration: "IL-04",
      title: "Escribile directo",
      text: "Contactá al emprendedor por WhatsApp desde su perfil, sin intermediarios.",
    },
  ],
  emprendedor: [
    {
      illustration: "IL-05",
      title: "Creá tu perfil",
      text: "Un onboarding guiado te lleva paso a paso para dejar tu emprendimiento listo.",
    },
    {
      illustration: "IL-06",
      title: "Mostrá lo que hacés",
      text: "Tu perfil queda visible en el mapa para quienes están cerca, siempre, no solo el día que publicás.",
    },
    {
      illustration: "IL-07",
      title: "Recibí contactos y valoraciones",
      text: "Te escriben directo por WhatsApp y tu reputación se construye con las valoraciones de tus clientes.",
    },
  ],
};

export type Feature = {
  tag: string;
  title: string;
  text: string;
  illustration: string;
  screenshot: string;
};

export const features: Feature[] = [
  {
    tag: "Mapa interactivo",
    title: "Mirá qué hay a tu alrededor.",
    text: "Cada emprendimiento aparece en el mapa. Te movés por tu zona y descubrís lugares que ni sabías que estaban ahí.",
    illustration: "IL-08",
    screenshot: "CAPTURA-01",
  },
  {
    tag: "Buscador con filtros",
    title: "Encontrá justo lo que buscás.",
    text: "Buscá por nombre, rubro y más. Los filtros te ahorran tiempo para llegar directo a lo que necesitás.",
    illustration: "IL-09",
    screenshot: "CAPTURA-02",
  },
  {
    tag: "Contacto por WhatsApp",
    title: "Sin intermediarios.",
    text: "Un toque y estás hablando con el emprendedor. Ventu te acerca; la charla es entre ustedes.",
    illustration: "IL-10",
    screenshot: "CAPTURA-03",
  },
  {
    tag: "Valoraciones",
    title: "Confianza que se construye entre vecinos.",
    text: "Las valoraciones ayudan a elegir mejor y le dan a cada emprendedor una reputación propia, hecha con su trabajo.",
    illustration: "IL-11",
    screenshot: "CAPTURA-04",
  },
  {
    tag: "Onboarding",
    title: "Tu perfil, listo en minutos.",
    text: "Un recorrido guiado te acompaña para crear tu perfil de emprendedor sin perderte en el camino.",
    illustration: "IL-12",
    screenshot: "CAPTURA-05",
  },
];

export const compare = {
  eyebrow: "Para emprendedores",
  title: "Visibilidad sin depender de publicar todo el tiempo.",
  lead: "Las redes sirven, pero te piden constancia infinita. Ventu trabaja para vos todos los días.",
  themLabel: "Solo redes sociales",
  rows: [
    { label: "Te encuentran por cercanía", us: "Sí", them: "A veces" },
    { label: "Dependés del algoritmo", us: "No", them: "Sí" },
    { label: "Tu perfil siempre está visible", us: "Sí", them: "Hasta que baja el alcance" },
    { label: "Contacto directo por WhatsApp", us: "Sí", them: "Depende de la red" },
    { label: "Valoraciones de clientes en tu perfil", us: "Sí", them: "Según la red" },
    { label: "Pensado para emprendimientos locales", us: "Sí", them: "No" },
  ],
};

export type GuideTask = {
  id: string; // ancla: #v-… para vecino, #e-… para emprendedor
  title: string;
  intro: string;
  steps: string[];
  tip?: string;
  illustration: string;
};

/* BORRADOR: ajustá los pasos a los nombres reales de botones y pantallas. */
export const guide: Record<Profile, GuideTask[]> = {
  vecino: [
    {
      id: "v-mapa",
      title: "Explorar el mapa",
      intro: "Descubrí qué emprendimientos hay cerca tuyo.",
      steps: [
        "Abrí Ventu y entrá al mapa.",
        "Movete por la zona; cada pin es un emprendimiento.",
        "Tocá un pin para ver su tarjeta y entrar a su perfil.",
      ],
      illustration: "IL-13",
    },
    {
      id: "v-buscar",
      title: "Buscar con filtros",
      intro: "Llegá más rápido a lo que necesitás.",
      steps: [
        "Escribí lo que buscás en el buscador.",
        "Abrí los filtros y elegí rubro u otras opciones.",
        "Mirá los resultados y entrá al que te interese.",
      ],
      illustration: "IL-14",
    },
    {
      id: "v-contacto",
      title: "Contactar por WhatsApp",
      intro: "Hablá directo con quien lo hace.",
      steps: [
        "Entrá al perfil del emprendimiento.",
        "Tocá el botón de contacto.",
        "Se abre WhatsApp con el chat listo para escribir.",
      ],
      tip: "Contale qué necesitás en el primer mensaje; así te responden más rápido.",
      illustration: "IL-15",
    },
    {
      id: "v-rating",
      title: "Dejar una valoración",
      intro: "Ayudá a otros vecinos a elegir bien.",
      steps: [
        "Entrá al perfil del emprendimiento.",
        "Elegí tu puntaje con las estrellas.",
        "Confirmá y listo.",
      ],
      illustration: "IL-16",
    },
  ],
  emprendedor: [
    {
      id: "e-perfil",
      title: "Crear mi perfil",
      intro: "El onboarding te guía de principio a fin.",
      steps: [
        "Registrate y elegí que sos emprendedor.",
        "Seguí el onboarding y completá los datos de tu emprendimiento.",
        "Agregá tu contacto de WhatsApp.",
        "Revisá cómo se ve y publicá.",
      ],
      illustration: "IL-17",
    },
    {
      id: "e-mostrar",
      title: "Mostrar lo que hago",
      intro: "Que tu perfil cuente bien tu historia.",
      steps: [
        "Sumá fotos de tus productos o trabajos.",
        "Escribí una descripción corta y clara.",
        "Elegí el rubro correcto para que te encuentren.",
      ],
      tip: "Un perfil completo se ve mejor y genera más confianza.",
      illustration: "IL-18",
    },
    {
      id: "e-contactos",
      title: "Atender contactos",
      intro: "Los vecinos te escriben directo.",
      steps: [
        "Recibís el mensaje en tu WhatsApp.",
        "Respondé como lo harías con cualquier cliente.",
      ],
      illustration: "IL-19",
    },
    {
      id: "e-rating",
      title: "Ver mis valoraciones",
      intro: "Tu reputación crece con cada cliente.",
      steps: ["Entrá a tu perfil.", "Mirá tu puntaje y las valoraciones recibidas."],
      illustration: "IL-20",
    },
  ],
};

export type FaqItem = {
  q: string;
  /** Texto de la respuesta. Si `todo` es true se marca en amarillo: falta completar. */
  a: string;
  todo?: boolean;
};

export const faq: FaqItem[] = [
  {
    q: "¿Ventu es gratis?",
    a: "Si! Ventu es completamente gratuito. La idea principal es que puedas mostrar tu emprendimiento de forma sencilla, sin pagos innecesarios."
  },
  {
    q: "¿En qué zonas funciona?",
    a: "Actualmente está funcionando en Argentina, pero muy pronto estaremos en varios paises de latinoamerica.",
  },
  {
    q: "¿Cómo me registro como emprendedor?",
    a: "Creás tu cuenta, elegís el perfil de emprendedor y seguís el onboarding guiado. Está explicado paso a paso en la guía de uso.",
  },
  {
    q: "¿Cómo me contacta un cliente?",
    a: "Directo por WhatsApp, desde el botón de contacto de tu perfil. Sin intermediarios.",
  },
  {
    q: "¿Para qué sirven las valoraciones?",
    a: "Ayudan a los vecinos a elegir y le dan a cada emprendimiento una reputación propia. Además de que les sirve a los emprendimientos a posicionarse mejor dentro de Ventu.",
  },
];

export const finalCta = {
  eyebrow: "La app",
  title: "Tu barrio emprende. Encontralo.",
  text: "La app que conecta a los vecinos con los emprendimientos de su barrio. Muy pronto en App Store y Google Play.",
  illustration: "IL-21",
};
