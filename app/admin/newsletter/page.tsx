import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export default async function AdminNewsletterPage() {
  await requireRole(["ADMIN"]);
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Newsletter</h2>
        <Link
          href="/admin/newsletter/export"
          className="rounded-full border border-neon/40 px-4 py-2 text-sm text-neon"
        >
          Export CSV
        </Link>
      </div>
      <div className="rounded-2xl border border-white/10 bg-steel/70 p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="py-2">Email</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-t border-white/5">
                <td className="py-2 text-slate-200">{subscriber.email}</td>
                <td className="py-2 text-slate-400">
                  {subscriber.createdAt.toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
