import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
  consent: z.literal("on", {
    errorMap: () => ({ message: "Consent required" }),
  }),
});

export const postSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().min(10),
  contentMarkdown: z.string().min(20),
  tags: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  coverImageUrl: z.string().optional(),
});

export const teamSchema = z.object({
  name: z.string().min(2),
  roleTitle: z.string().min(2),
  bio: z.string().min(10),
  photoUrl: z.string().url(),
  links: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
});

export const videoSchema = z.object({
  title: z.string().min(2),
  youtubeId: z.string().min(4),
  description: z.string().min(10),
  thumbnailUrl: z.string().url(),
  publishedAt: z.string().min(4),
  featured: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
});
