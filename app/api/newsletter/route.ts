import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const formData = await request.formData();
  const data = {
    email: String(formData.get("email") ?? ""),
    consent: String(formData.get("consent") ?? ""),
  };

  const parsed = newsletterSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const limiter = rateLimit(`newsletter:${data.email}`, 3, 60_000);
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Trop de tentatives" }, { status: 429 });
  }

  try {
    await prisma.newsletterSubscriber.create({
      data: { email: parsed.data.email },
    });
  } catch (error) {
    return NextResponse.json({ error: "Déjà inscrit" }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
