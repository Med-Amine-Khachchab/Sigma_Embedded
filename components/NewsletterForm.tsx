"use client";

import { useState } from "react";
import { Button } from "./Button";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      setStatus("ok");
      setMessage("Merci pour votre inscription !");
      event.currentTarget.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      setMessage(data?.error ?? "Une erreur est survenue");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
      <input
        type="email"
        name="email"
        required
        placeholder="Votre email"
        className="w-full rounded-full border border-white/10 bg-midnight/80 px-4 py-2 text-sm"
      />
      <label className="flex items-center gap-2 text-xs text-slate-300">
        <input name="consent" type="checkbox" required />
        J'accepte de recevoir les actualités Sigma Embedded.
      </label>
      <Button type="submit">S'inscrire</Button>
      {message && (
        <p className={status === "ok" ? "text-neon" : "text-red-400"}>{message}</p>
      )}
    </form>
  );
}
