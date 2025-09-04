'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ctfs, challenges, teamMembers } from './data';
import { ctfSchema, memberSchema, challengeSchema, Ctf, TeamMember, Challenge } from './definitions';

const USERNAME = 'T3chC0brA';
const PASSWORD = 'T3chC0brAT3chC0brA@';
const COOKIE_NAME = 'r00t-r3b3lz-auth';

type ActionResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
}

export async function authenticate(_prevState: string | undefined, formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  if (username === USERNAME && password === PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, 'true', { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
    redirect('/admin-page');
  }

  return 'Invalid username or password. Please try again.';
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/login');
}

// CTF Actions
export async function upsertCtf(formData: unknown, id: string | null): Promise<ActionResponse<Ctf>> {
  const validatedFields = ctfSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed. Could not save CTF." };
  }

  const { data } = validatedFields;
  let newOrUpdatedCtf: Ctf;

  try {
    if (id) {
      // Update
      const index = ctfs.findIndex(c => c.id === id);
      if (index === -1) return { success: false, message: "CTF not found." };
      newOrUpdatedCtf = { ...ctfs[index], ...data };
      ctfs[index] = newOrUpdatedCtf;
    } else {
      // Create
      newOrUpdatedCtf = { ...data, id: crypto.randomUUID() };
      ctfs.unshift(newOrUpdatedCtf);
    }
    
    revalidatePath('/admin-page/ctfs');
    revalidatePath('/admin-page');
    revalidatePath(`/ctfs/${newOrUpdatedCtf.slug}`);
    revalidatePath('/');
    return { success: true, message: "CTF saved successfully.", data: newOrUpdatedCtf };
  } catch (error) {
    return { success: false, message: "An error occurred while saving the CTF." };
  }
}

export async function deleteCtf(id: string): Promise<ActionResponse<null>> {
  try {
    const index = ctfs.findIndex(c => c.id === id);
    if (index === -1) return { success: false, message: "CTF not found." };

    ctfs.splice(index, 1);
    revalidatePath('/admin-page/ctfs');
    revalidatePath('/admin-page');
    revalidatePath('/');
    return { success: true, message: "CTF deleted successfully." };
  } catch(e) {
    return { success: false, message: "An error occurred." };
  }
}

// Member Actions
export async function upsertMember(formData: unknown, id: string | null): Promise<ActionResponse<TeamMember>> {
  const validatedFields = memberSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed. Could not save member." };
  }

  const { data } = validatedFields;
  let newOrUpdatedMember: TeamMember;

  try {
    if (id) {
      const index = teamMembers.findIndex(m => m.id === id);
      if (index === -1) return { success: false, message: "Member not found." };
      newOrUpdatedMember = { ...teamMembers[index], ...data };
      teamMembers[index] = newOrUpdatedMember;
    } else {
      newOrUpdatedMember = { ...data, id: crypto.randomUUID() };
      teamMembers.unshift(newOrUpdatedMember);
    }
    
    revalidatePath('/admin-page/members');
    revalidatePath('/admin-page');
    revalidatePath('/members');
    return { success: true, message: "Member saved successfully.", data: newOrUpdatedMember };
  } catch (error) {
    return { success: false, message: "An error occurred while saving the member." };
  }
}

export async function deleteMember(id: string): Promise<ActionResponse<null>> {
   try {
    const index = teamMembers.findIndex(m => m.id === id);
    if (index === -1) return { success: false, message: "Member not found." };

    teamMembers.splice(index, 1);
    revalidatePath('/admin-page/members');
    revalidatePath('/admin-page');
    revalidatePath('/members');
    return { success: true, message: "Member deleted successfully." };
  } catch(e) {
    return { success: false, message: "An error occurred." };
  }
}

// Challenge Actions
export async function upsertChallenge(formData: unknown, id: string | null): Promise<ActionResponse<Challenge>> {
  const validatedFields = challengeSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Validation failed. Could not save challenge." };
  }

  const { data } = validatedFields;
  let newOrUpdatedChallenge: Challenge;

  try {
    if (id) {
      const index = challenges.findIndex(c => c.id === id);
      if (index === -1) return { success: false, message: "Challenge not found." };
      newOrUpdatedChallenge = { ...challenges[index], ...data };
      challenges[index] = newOrUpdatedChallenge;
    } else {
      newOrUpdatedChallenge = { ...data, id: crypto.randomUUID() };
      challenges.unshift(newOrUpdatedChallenge);
    }
    
    const ctf = ctfs.find(c => c.id === newOrUpdatedChallenge.ctfId);
    revalidatePath('/admin-page/writeups');
    revalidatePath('/admin-page');
    if (ctf) {
      revalidatePath(`/ctfs/${ctf.slug}`);
    }
    return { success: true, message: "Challenge saved successfully.", data: newOrUpdatedChallenge };
  } catch (error) {
    return { success: false, message: "An error occurred while saving the challenge." };
  }
}


export async function deleteChallenge(id: string): Promise<ActionResponse<null>> {
   try {
    const index = challenges.findIndex(c => c.id === id);
    if (index === -1) return { success: false, message: "Challenge not found." };

    const challenge = challenges[index];
    const ctf = ctfs.find(c => c.id === challenge.ctfId);

    challenges.splice(index, 1);
    revalidatePath('/admin-page/writeups');
    revalidatePath('/admin-page');
    if (ctf) {
      revalidatePath(`/ctfs/${ctf.slug}`);
    }
    return { success: true, message: "Challenge deleted successfully." };
  } catch(e) {
    return { success: false, message: "An error occurred." };
  }
}
