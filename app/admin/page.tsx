import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [postCount, draftCount, memberCount, subscriberCount] = await Promise.all([
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.teamMember.count(),
    prisma.newsletterSubscriber.count(),
  ]);

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {[
        { label: "Articles publiés", value: postCount },
        { label: "Brouillons", value: draftCount },
        { label: "Membres", value: memberCount },
        { label: "Newsletter", value: subscriberCount },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-steel/70 p-6"
        >
          <p className="text-sm text-slate-300">{item.label}</p>
          <h2 className="mt-2 text-3xl font-semibold text-neon">{item.value}</h2>
        </div>
      ))}
    </section>
  );
}
