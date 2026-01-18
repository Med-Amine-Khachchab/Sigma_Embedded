"use client";

import { useMemo, useState } from "react";
import { marked } from "marked";

marked.setOptions({ breaks: true });

type Props = {
  name: string;
  defaultValue?: string;
};

export function MarkdownEditor({ name, defaultValue }: Props) {
  const [value, setValue] = useState(defaultValue ?? "");
  const preview = useMemo(() => marked.parse(value), [value]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <label className="text-xs uppercase text-slate-400">Markdown</label>
        <textarea
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="mt-2 h-72 w-full rounded-lg border border-white/10 bg-midnight/80 p-3 text-sm text-slate-100"
        />
      </div>
      <div>
        <label className="text-xs uppercase text-slate-400">Preview</label>
        <div
          className="prose prose-invert mt-2 h-72 max-w-none overflow-y-auto rounded-lg border border-white/10 bg-midnight/80 p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </div>
    </div>
  );
}
