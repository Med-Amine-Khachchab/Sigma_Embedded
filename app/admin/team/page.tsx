import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { teamSchema } from "@/lib/validation";

export default async function AdminTeamPage() {
  await requireRole(["ADMIN", "EDITOR"]);
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  async function createMember(formData: FormData) {
    "use server";
    const payload = {
      name: String(formData.get("name")),
      roleTitle: String(formData.get("roleTitle")),
      bio: String(formData.get("bio")),
      photoUrl: String(formData.get("photoUrl")),
      links: String(formData.get("links") ?? ""),
      order: formData.get("order"),
    };
    const parsed = teamSchema.safeParse(payload);
    if (!parsed.success) return;
    let links: Record<string, string> = { linkedin: "https://linkedin.com" };
    if (parsed.data.links) {
      try {
        links = JSON.parse(parsed.data.links) as Record<string, string>;
      } catch {
        links = { linkedin: "https://linkedin.com" };
      }
    }
    await prisma.teamMember.create({
      data: {
        name: parsed.data.name,
        roleTitle: parsed.data.roleTitle,
        bio: parsed.data.bio,
        photoUrl: parsed.data.photoUrl,
        links,
        order: parsed.data.order ?? 0,
      },
    });
    revalidatePath("/admin/team");
  }

  async function deleteMember(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath("/admin/team");
  }

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-steel/70 p-6">
        <h2 className="text-lg font-semibold">Ajouter un membre</h2>
        <form action={createMember} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="name" placeholder="Nom" className="rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" required />
          <input name="roleTitle" placeholder="Role" className="rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" required />
          <input name="photoUrl" placeholder="Photo URL" className="rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" required />
          <input name="order" placeholder="Order" className="rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" />
          <textarea name="bio" placeholder="Bio" className="md:col-span-2 rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" rows={2} required />
          <textarea name="links" placeholder='Liens JSON {"linkedin":"..."}' className="md:col-span-2 rounded-lg border border-white/10 bg-midnight/80 px-3 py-2" rows={2} />
          <button className="rounded-full border border-neon/40 px-4 py-2 text-sm text-neon md:col-span-2">
            Enregistrer
          </button>
        </form>
      </div>
      <div className="grid gap-4">
        {members.map((member) => (
          <div key={member.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-steel/70 p-4">
            <div>
              <h3 className="text-sm font-semibold">{member.name}</h3>
              <p className="text-xs text-slate-400">{member.roleTitle}</p>
            </div>
            <form action={deleteMember}>
              <input type="hidden" name="id" value={member.id} />
              <button className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-300">Supprimer</button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
