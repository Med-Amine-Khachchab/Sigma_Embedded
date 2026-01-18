import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold">L'équipe Sigma Embedded</h1>
        <p className="mt-2 text-sm text-slate-300">
          Ingénieurs firmware, architectes hardware et créateurs de contenu.
        </p>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl border border-white/10 bg-steel/70 p-6"
          >
            <Image
              src={member.photoUrl}
              alt={member.name}
              width={320}
              height={320}
              className="rounded-2xl"
            />
            <h2 className="mt-4 text-lg font-semibold">{member.name}</h2>
            <p className="text-sm text-neon">{member.roleTitle}</p>
            <p className="mt-3 text-sm text-slate-300">{member.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
              {Object.entries(member.links as Record<string, string>).map(([label, url]) => (
                <a
                  key={label}
                  href={url}
                  className="rounded-full border border-white/10 px-3 py-1"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
