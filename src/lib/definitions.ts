
import { z } from "zod";

export type Ctf = {
  id: string;
  slug: string;
  name: string;
  bannerUrl: string;
  description: string;
};

export type Challenge = {
  id: string;
  ctfId: string;
  title: string;
  category: 'Web' | 'Pwn' | 'Crypto' | 'Misc' | 'Rev' | 'OSINT';
  description: string;
  writeup: string; // Markdown-like content
  imageUrl?: string;
};

export type TeamMember = {
  id:string;
  name: string;
  handle: string;
  role: string;
  avatarUrl: string;
};

// Zod schemas for form validation
export const ctfSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  slug: z.string().min(1, { message: "Slug is required." }).regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
  description: z.string().min(1, { message: "Description is required." }),
  bannerUrl: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    if (val.startsWith('/uploads/')) return true; // Allow uploaded files
    return z.string().url().safeParse(val).success; // Allow valid URLs
  }, {
    message: "Please enter a valid URL or upload an image.",
  }),
});

export const memberSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  handle: z.string().min(2, { message: "Handle must be at least 2 characters." }).startsWith('@', { message: "Handle must start with '@'." }),
  role: z.string().min(1, { message: "Role is required." }),
  avatarUrl: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    if (val.startsWith('/uploads/')) return true; // Allow uploaded files
    return z.string().url().safeParse(val).success; // Allow valid URLs
  }, {
    message: "Please enter a valid URL or upload an image.",
  }),
});

export const challengeSchema = z.object({
  ctfId: z.string({ required_error: "Please select a CTF." }).min(1, "Please select a CTF."),
  title: z.string().min(1, { message: "Title is required." }),
  category: z.enum(['Web', 'Pwn', 'Crypto', 'Misc', 'Rev', 'OSINT'], { required_error: "Please select a category." }),
  description: z.string().min(1, { message: "Description is required." }),
  writeup: z.string().min(1, { message: "Write-up content is required." }),
  imageUrl: z.string().refine((val) => {
    if (val === "") return true; // Allow empty
    if (val.startsWith('/uploads/')) return true; // Allow uploaded files
    return z.string().url().safeParse(val).success; // Allow valid URLs
  }, {
    message: "Please enter a valid URL or upload an image.",
  }).optional(),
});

export type CtfFormData = z.infer<typeof ctfSchema>;
export type MemberFormData = z.infer<typeof memberSchema>;
export type ChallengeFormData = z.infer<typeof challengeSchema>;
