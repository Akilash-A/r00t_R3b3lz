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
  category: 'Web' | 'Pwn' | 'Crypto' | 'Misc' | 'Rev';
  description: string;
  writeup: string; // Markdown-like content
};

export type TeamMember = {
  id:string;
  name: string;
  handle: string;
  role: string;
  avatarUrl: string;
};

// Zod schemas for form validation
export const memberSchema = z.object({
  id: z.string().optional(), // used for edits
  name: z.string().min(1, { message: "Name is required." }),
  handle: z.string().min(2, { message: "Handle must be at least 2 characters." }).startsWith('@', { message: "Handle must start with '@'." }),
  role: z.string().min(1, { message: "Role is required." }),
  // avatarUrl is a string, but the form will have a file input. We won't implement the upload itself.
});

export const challengeSchema = z.object({
  id: z.string().optional(), // used for edits
  ctfId: z.string({ required_error: "Please select a CTF." }).min(1, "Please select a CTF."),
  title: z.string().min(1, { message: "Title is required." }),
  category: z.enum(['Web', 'Pwn', 'Crypto', 'Misc', 'Rev'], { required_error: "Please select a category." }),
  description: z.string().min(1, { message: "Description is required." }),
  writeup: z.string().min(1, { message: "Write-up content is required." }),
});

export type MemberFormData = z.infer<typeof memberSchema>;
export type ChallengeFormData = z.infer<typeof challengeSchema>;
