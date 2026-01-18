import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { postSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { ImageUpload } from "@/components/ImageUpload";

type Props = {
  params: { id: string };
};

export default async function EditPostPage({ params }: Props) {
  await requireRole(["ADMIN", "EDITOR"]);
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  async function updatePost(formData: FormData) {
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
    while (true) {
      const existing = await prisma.post.findUnique({ where: { slug } });
      if (!existing || existing.id === params.id) break;
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }
    const tagList = parsed.data.tags
      ? parsed.data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];
    await prisma.post.update({
      where: { id: params.id },
      data: {
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt,
        contentMarkdown: parsed.data.contentMarkdown,
        tags: tagList,
        status: parsed.data.status,
        coverImageUrl: parsed.data.coverImageUrl || null,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
    });
    redirect("/admin/posts");
  }

  return (
    <form action={updatePost} className="space-y-6">
      <h2 className="text-xl font-semibold">Éditer l'article</h2>
      <div className="grid gap-4">
        <input
          name="title"
          defaultValue={post.title}
          className="rounded-lg border border-white/10 bg-midnight/80 px-4 py-2"
          required
        />
        <textarea
          name="excerpt"
          defaultValue={post.excerpt}
          className="rounded-lg border border-white/10 bg-midnight/80 px-4 py-2"
          rows={3}
          required
        />
        <MarkdownEditor name="contentMarkdown" defaultValue={post.contentMarkdown} />
        <input
          name="tags"
          defaultValue={post.tags.join(", ")}
          className="rounded-lg border border-white/10 bg-midnight/80 px-4 py-2"
        />
        <select
          name="status"
          defaultValue={post.status}
          className="rounded-lg border border-white/10 bg-midnight/80 px-4 py-2"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <ImageUpload name="coverImageUrl" defaultValue={post.coverImageUrl} />
      </div>
      <button className="rounded-full border border-neon/40 px-6 py-2 text-sm text-neon">
        Enregistrer
      </button>
    </form>
  );
}
