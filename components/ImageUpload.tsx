"use client";

import { useState } from "react";

type Props = {
  name: string;
  defaultValue?: string | null;
};

export function ImageUpload({ name, defaultValue }: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<string | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setStatus("Upload en cours...");
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      setUrl(data.url);
      setStatus("Upload terminé");
    } else {
      const data = await response.json().catch(() => ({}));
      setStatus(data?.error ?? "Erreur upload");
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase text-slate-400">Cover image</label>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <input type="hidden" name={name} value={url} />
      {url && <p className="text-xs text-neon">{url}</p>}
      {status && <p className="text-xs text-slate-400">{status}</p>}
    </div>
  );
}
