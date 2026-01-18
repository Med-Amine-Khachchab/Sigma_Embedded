import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { videoSchema } from "@/lib/validation";

export default async function AdminMediaPage() {
  await requireRole(["ADMIN", "EDITOR"]);
  const videos = await prisma.video.findMany({ orderBy: [{ order: "asc" }, { publishedAt: "desc" }] });

  async function createVideo(formData: FormData) {
    "use server";
    const payload = {
      title: String(formData.get("title")),
      youtubeId: String(formData.get("youtubeId")),
      description: String(formData.get("description")),
      thumbnailUrl: String(formData.get("thumbnailUrl")),
      publishedAt: String(formData.get("publishedAt")),
      featured: String(formData.get("featured")) || undefined,
      order: formData.get("order"),
    };
    const parsed = videoSchema.safeParse(payload);
    if (!parsed.success) return;
    await prisma.video.create({
      data: {
        title: parsed.data.title,
        youtubeId: parsed.data.youtubeId,
        description: parsed.data.description,
        thumbnailUrl: parsed.data.thumbnailUrl,
        publishedAt: new Date(parsed.data.publishedAt),
        featured: Boolean(parsed.data.featured),
        order: parsed.data.order ?? 0,
      },
    });
    revalidatePath("/admin/media");
  }

  async function deleteVideo(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    await prisma.video.delete({ where: { id } });
    revalidatePath("/admin/media");
  }

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-steel/70 p-6">
        <h2 className="text-lg font-semibold">Ajouter une vidéo</h2>
        <form action={createVideo} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="title" placeholder="Titre" className="rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" required />
          <input name="youtubeId" placeholder="YouTube ID" className="rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" required />
          <input name="thumbnailUrl" placeholder="Thumbnail URL" className="rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" required />
          <input name="publishedAt" placeholder="2024-01-01" className="rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" required />
          <input name="order" placeholder="Order" className="rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" name="featured" />
            Featured
          </label>
          <textarea name="description" placeholder="Description" className="md:col-span-2 rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" rows={2} required />
          <button className="rounded-full border border-neon/40 px-4 py-2 text-sm text-neon md:col-span-2">
            Enregistrer
          </button>
        </form>
      </div>
      <div className="grid gap-4">
        {videos.map((video) => (
          <div key={video.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-steel/70 p-4">
            <div>
              <h3 className="text-sm font-semibold">{video.title}</h3>
              <p className="text-xs text-slate-400">{video.youtubeId}</p>
            </div>
            <form action={deleteVideo}>
              <input type="hidden" name="id" value={video.id} />
              <button className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-300">Supprimer</button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
