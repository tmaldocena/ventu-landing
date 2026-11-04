import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-secondary/10 pb-12 pt-9 text-[0.92rem] text-secondary/65">
      <Container className="flex flex-wrap justify-between gap-4">
        <span>© {new Date().getFullYear()} Ventu</span>
        <span>Hecho por <a href="https://desarrollo-cuyo-lac.vercel.app/" target="_blank" className="hover:text-primary transition-colors">Desarrollo Cuyo</a> </span>
      </Container>
    </footer>
  );
}
