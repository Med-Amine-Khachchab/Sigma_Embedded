import Link from "next/link";
import { requireRole } from "@/lib/auth-guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["ADMIN", "EDITOR"]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Back-office</h1>
          <p className="text-sm text-slate-300">Gestion Sigma Embedded</p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm">
          <Link href="/admin" className="rounded-full border border-white/10 px-4 py-2">
            Dashboard
          </Link>
          <Link
            href="/admin/posts"
            className="rounded-full border border-white/10 px-4 py-2"
          >
            Articles
          </Link>
          <Link
            href="/admin/media"
            className="rounded-full border border-white/10 px-4 py-2"
          >
            Media
          </Link>
          <Link
            href="/admin/team"
            className="rounded-full border border-white/10 px-4 py-2"
          >
            Équipe
          </Link>
          <Link
            href="/admin/newsletter"
            className="rounded-full border border-white/10 px-4 py-2"
          >
            Newsletter
          </Link>
        </nav>
      </div>
      {children}
    </main>
  );
}
