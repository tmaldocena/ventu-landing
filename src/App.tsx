import { ProfileProvider } from "@/context/ProfileContext";
import { BackToTop } from "@/components/ui/BackToTop";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { Compare } from "@/components/sections/Compare";
import { Guide } from "@/components/sections/Guide";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export default function App() {
  return (
    <ProfileProvider>
      <ScrollProgress />
      <Nav />
      <main id="top">
        <Hero />
        <HowItWorks />
        <Features />
        <Compare />
        <Guide />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <BackToTop />
    </ProfileProvider>
  );
}
