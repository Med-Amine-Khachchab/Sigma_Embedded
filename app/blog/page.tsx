import Link from "next/link";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 6;

type Props = {
  searchParams?: { page?: string; q?: string; tag?: string };
};

export default async function BlogPage({ searchParams }: Props) {
  const page = Number(searchParams?.page ?? "1");
  const query = searchParams?.q?.trim();
  const tag = searchParams?.tag?.trim();

  const where = {
    status: "PUBLISHED" as const,
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { excerpt: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(tag ? { tags: { has: tag } } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Blog Sigma Embedded</h1>
          <p className="mt-2 text-sm text-slate-300">
            Recherche, tags et contenus avancés sur l'embarqué.
          </p>
        </div>
        <form className="flex gap-2">
          <input
            type="text"
            name="q"
            placeholder="Recherche..."
            defaultValue={query}
            className="rounded-full border border-white/10 bg-midnight/80 px-4 py-2 text-sm"
          />
          <button className="rounded-full border border-neon/40 px-4 py-2 text-sm text-neon">
            Filtrer
          </button>
        </form>
      </header>

      <div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-400">
        {[
          "RTOS",
          "STM32",
          "C/C++",
          "FreeRTOS",
          "UART",
          "I2C",
          "CAN",
          "Yocto",
        ].map((tagName) => (
          <Link
            key={tagName}
            href={`/blog?tag=${encodeURIComponent(tagName)}`}
            className={`rounded-full border px-3 py-1 ${
              tag === tagName
                ? "border-neon text-neon"
                : "border-white/10 text-slate-300"
            }`}
          >
            {tagName}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="rounded-2xl border border-white/10 bg-steel/70 p-6 transition hover:border-neon/40"
          >
            <div className="flex flex-wrap gap-2 text-xs text-neon">
              {post.tags.slice(0, 3).map((tagLabel) => (
                <span
                  key={tagLabel}
                  className="rounded-full border border-neon/30 px-3 py-1"
                >
                  {tagLabel}
                </span>
              ))}
            </div>
            <h2 className="mt-4 text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{post.excerpt}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex items-center justify-center gap-3 text-sm">
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;
          const params = new URLSearchParams();
          if (query) params.set("q", query);
          if (tag) params.set("tag", tag);
          params.set("page", String(pageNumber));
          return (
            <Link
              key={pageNumber}
              href={`/blog?${params.toString()}`}
              className={`rounded-full border px-4 py-1 ${
                pageNumber === page
                  ? "border-neon text-neon"
                  : "border-white/10 text-slate-300"
              }`}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
