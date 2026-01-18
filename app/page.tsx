import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { NewsletterForm } from "@/components/NewsletterForm";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      excerpt: true,
      slug: true,
      tags: true,
    },
  });

  const videos = await prisma.video.findMany({
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: 4,
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-neon">
            Modern Embedded Hub
          </span>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Sigma Embedded, la plateforme futuriste pour le firmware &amp; RTOS.
          </h1>
          <p className="text-slate-300">
            Explorez des articles avancés, des vidéos pratiques et une équipe dédiée
            à l'innovation embarquée.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/blog">Voir les blogs</Button>
            <Button href="/media" variant="secondary">
              Regarder la chaîne
            </Button>
          </div>
        </div>
        <div className="relative rounded-3xl border border-white/10 bg-steel/80 p-6 shadow-glow">
          <Image
            src="/images/hero-board.svg"
            alt="Sigma Embedded"
            width={560}
            height={420}
            className="rounded-2xl"
          />
          <div className="absolute -bottom-6 -right-6 rounded-2xl border border-neon/30 bg-midnight/90 p-4 text-xs text-slate-300">
            <p>Design futuriste + circuit patterns</p>
            <p className="text-neon">Firmware / RTOS / Hardware</p>
          </div>
        </div>
      </section>

      <section className="mt-20 grid gap-8 md:grid-cols-4">
        {[
          { title: "Embedded", text: "Architecture SoC, drivers et intégration." },
          { title: "Firmware", text: "C/C++ performant, DMA et low-power." },
          { title: "RTOS", text: "FreeRTOS, Zephyr, temps réel." },
          { title: "Co-design", text: "Hardware/Software pour prototypes." },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-steel/70 p-5 glow-card"
          >
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm text-slate-300">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-20 grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Derniers articles</h2>
          <div className="grid gap-5">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="rounded-2xl border border-white/10 bg-steel/70 p-5 transition hover:border-neon/40"
              >
                <div className="flex flex-wrap gap-2 text-xs text-neon">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-neon/30 px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{post.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Newsletter</h2>
          <p className="mt-2 text-sm text-slate-300">
            Recevez nos dernières analyses sur les architectures embarquées.
          </p>
          <NewsletterForm />
          <div className="mt-8 rounded-2xl border border-white/10 bg-steel/70 p-5">
            <h3 className="text-lg font-semibold">Rejoindre Discord</h3>
            <p className="mt-2 text-sm text-slate-300">
              Communauté embedded en temps réel.
            </p>
            <Button href="#" variant="secondary" className="mt-4">
              Lien Discord (placeholder)
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold">Vidéos récentes</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="rounded-2xl border border-white/10 bg-steel/70 p-4"
            >
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
        </div>
      </section>
    </main>
  );
}
