import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function MediaPage() {
  const videos = await prisma.video.findMany({
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  const featured = videos.find((video) => video.featured) ?? videos[0];
  const grid = videos.slice(0, 8);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold">Sigma Embedded Media</h1>
        <p className="mt-2 text-sm text-slate-300">
          La chaîne dédiée aux labs, teardown et stratégies firmware.
        </p>
      </header>

      {featured && (
        <section className="mt-10 rounded-3xl border border-white/10 bg-steel/70 p-6">
          <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
            <Image
              src={featured.thumbnailUrl}
              alt={featured.title}
              width={720}
              height={420}
              className="rounded-2xl"
            />
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-neon">
                Featured
              </span>
              <h2 className="text-xl font-semibold">{featured.title}</h2>
              <p className="text-sm text-slate-300">{featured.description}</p>
              <p className="text-xs text-slate-400">
                {featured.publishedAt.toLocaleDateString("fr-FR")}
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${featured.youtubeId}`}
                className="inline-flex rounded-full border border-neon/40 px-4 py-2 text-sm text-neon"
              >
                Voir sur YouTube
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="mt-12 grid gap-6 md:grid-cols-4">
        {grid.map((video) => (
          <div key={video.id} className="rounded-2xl border border-white/10 bg-steel/70 p-4">
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              width={320}
              height={180}
              className="rounded-xl"
            />
            <h3 className="mt-3 text-sm font-semibold">{video.title}</h3>
            <p className="mt-2 text-xs text-slate-400">{video.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
