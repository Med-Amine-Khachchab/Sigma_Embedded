import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({
  breaks: true,
});

marked.use({
  renderer: {
    heading(text, level) {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `<h${level} id="${id}">${text}</h${level}>`;
    },
  },
});

export function renderMarkdown(content: string) {
  const raw = marked.parse(content);
  return sanitizeHtml(raw, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      "*": ["class", "id"],
    },
  });
}
