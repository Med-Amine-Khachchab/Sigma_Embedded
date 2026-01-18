import Link from "next/link";
import { Button } from "./Button";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/blog", label: "Blog" },
  { href: "/media", label: "Media" },
  { href: "/team", label: "Equipe" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-midnight/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          Sigma <span className="text-neon">Embedded</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-neon">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button href="/login" variant="secondary">
            Connexion
          </Button>
          <Button href="/blog">Voir les blogs</Button>
        </div>
      </nav>
    </header>
  );
}
