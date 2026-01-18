"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/Button";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      redirect: true,
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/admin",
    });
    if (result?.error) {
      setError("Identifiants invalides");
    }
  }

  return (
    <main className="mx-auto flex max-w-6xl items-center justify-center px-6 py-20">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-steel/70 p-8">
        <h1 className="text-2xl font-semibold">Connexion</h1>
        <p className="mt-2 text-sm text-slate-300">
          Accédez au back-office Sigma Embedded.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="rounded-full border border-white/10 bg-midnight/80 px-4 py-2 text-sm"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Mot de passe"
            className="rounded-full border border-white/10 bg-midnight/80 px-4 py-2 text-sm"
          />
          <Button type="submit">Se connecter</Button>
        </form>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
    </main>
  );
}
