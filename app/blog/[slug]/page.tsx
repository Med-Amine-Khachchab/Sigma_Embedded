import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { renderMarkdown } from "@/lib/markdown";

type Props = {
  params: { slug: string };
};

function extractHeadings(markdown: string) {
  const lines = markdown.split("\n");
  return lines
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.replace("## ", "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return { text, id };
    });
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  const html = renderMarkdown(post.contentMarkdown);
  const toc = extractHeadings(post.contentMarkdown);
  const related = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: post.id },
      tags: { hasSome: post.tags.slice(0, 2) },
    },
    take: 3,
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <article className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex flex-wrap gap-2 text-xs text-neon">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-neon/30 px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-semibold">{post.title}</h1>
          <p className="mt-2 text-sm text-slate-400">
            Par {post.author.name} · {post.publishedAt?.toLocaleDateString("fr-FR")}
          </p>
          <div
            className="prose prose-invert mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-steel/70 p-5">
            <h2 className="text-sm font-semibold text-white">Table des matières</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="hover:text-neon">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-steel/70 p-5">
            <h2 className="text-sm font-semibold text-white">Partager</h2>
            <div className="mt-3 flex flex-col gap-2 text-xs text-slate-300">
              <span>LinkedIn (placeholder)</span>
              <span>X (placeholder)</span>
              <span>Copy link</span>
            </div>
          </div>
        </aside>
      </article>

      <section className="mt-16">
        <h2 className="text-xl font-semibold">Articles similaires</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.id}
              href={`/blog/${item.slug}`}
              className="rounded-2xl border border-white/10 bg-steel/70 p-4"
            >
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="mt-2 text-xs text-slate-300">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
