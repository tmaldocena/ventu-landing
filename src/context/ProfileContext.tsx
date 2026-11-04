import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Profile } from "@/types";

type ProfileContextValue = {
  profile: Profile;
  setProfile: (p: Profile) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

/** Prefijos de ancla de la guía → perfil al que pertenecen. */
const HASH_PREFIX: Array<[string, Profile]> = [
  ["#e-", "emprendedor"],
  ["#v-", "vecino"],
];

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>("vecino");

  // Si llegan a un ancla de la guía (#e-perfil, #v-mapa…), mostramos el
  // perfil correcto y scrolleamos cuando ya se renderizó el contenido.
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      const match = HASH_PREFIX.find(([prefix]) => hash.startsWith(prefix));
      if (!match) return;
      setProfile(match[1]);
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          document.getElementById(hash.slice(1))?.scrollIntoView(),
        ),
      );
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const value = useMemo(() => ({ profile, setProfile }), [profile]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile debe usarse dentro de <ProfileProvider>");
  return ctx;
}
