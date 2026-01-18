import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { ImageUpload } from "@/components/ImageUpload";

export default async function NewPostPage() {
  const session = await requireRole(["ADMIN", "EDITOR"]);

  async function createPost(formData: FormData) {
    "use server";
    const payload = {
      title: String(formData.get("title")),
      excerpt: String(formData.get("excerpt")),
      contentMarkdown: String(formData.get("contentMarkdown")),
      tags: String(formData.get("tags") ?? ""),
      status: String(formData.get("status")) as "DRAFT" | "PUBLISHED",
      coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
    };
    const parsed = postSchema.safeParse(payload);
    if (!parsed.success) {
      return;
    }
    const baseSlug = slugify(parsed.data.title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }
    const tagList = parsed.data.tags
      ? parsed.data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];
    await prisma.post.create({
      data: {
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt,
        contentMarkdown: parsed.data.contentMarkdown,
        tags: tagList,
        status: parsed.data.status,
        coverImageUrl: parsed.data.coverImageUrl || null,
        authorId: session.user.id,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
    });
    redirect("/admin/posts");
  }

  return (
    <form action={createPost} className="space-y-6">
      <h2 className="text-xl font-semibold">Nouvel article</h2>
      <div className="grid gap-4">
        <input
          name="title"
          placeholder="Titre"
          className="rounded-lg border border-white/10 bg-midnight/80 px-4 py-2"
          required
        />
        <textarea
          name="excerpt"
          placeholder="Extrait"
          className="rounded-lg border border-white/10 bg-midnight/80 px-4 py-2"
          rows={3}
          required
        />
        <MarkdownEditor name="contentMarkdown" />
        <input
          name="tags"
          placeholder="Tags séparés par des virgules"
          className="rounded-lg border border-white/10 bg-midnight/80 px-4 py-2"
        />
        <select
          name="status"
          className="rounded-lg border border-white/10 bg-midnight/80 px-4 py-2"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <ImageUpload name="coverImageUrl" />
      </div>
      <button className="rounded-full border border-neon/40 px-6 py-2 text-sm text-neon">
        Publier
      </button>
    </form>
  );
}
