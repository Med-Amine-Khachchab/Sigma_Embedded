import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export default async function AdminPostsPage() {
  const session = await requireRole(["ADMIN", "EDITOR"]);
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  async function deletePost(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/posts");
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Articles</h2>
        <Link href="/admin/posts/new" className="rounded-full border border-neon/40 px-4 py-2 text-sm text-neon">
          Nouvel article
        </Link>
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-steel/70 p-4"
          >
            <div>
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-xs text-slate-400">{post.status}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link
                href={`/admin/posts/${post.id}`}
                className="rounded-full border border-white/10 px-4 py-1"
              >
                Éditer
              </Link>
              <form action={deletePost}>
                <input type="hidden" name="id" value={post.id} />
                <button className="rounded-full border border-red-500/40 px-4 py-1 text-red-300">
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400">
        Connecté en tant que {session.user.email} ({session.user.role})
      </p>
    </section>
  );
}
