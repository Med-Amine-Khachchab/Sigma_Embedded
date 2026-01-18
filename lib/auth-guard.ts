import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

export async function requireRole(roles: string[]) {
  const session = await getServerSession(authOptions);
  if (!session || !roles.includes(session.user.role)) {
    redirect("/login");
  }
  return session;
}
