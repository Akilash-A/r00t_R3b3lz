'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ctfSchema, memberSchema, challengeSchema, Ctf, TeamMember, Challenge } from './definitions';
import connectToDatabase from './mongodb';
import { CtfModel, ChallengeModel, TeamMemberModel } from './models';

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
    await connectToDatabase();

    if (id) {
      // Update existing CTF
      const updatedCtf = await CtfModel.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      );
      
      if (!updatedCtf) {
        return { success: false, message: "CTF not found." };
      }
      
      newOrUpdatedCtf = {
        id: (updatedCtf as any)._id.toString(),
        slug: updatedCtf.slug,
        name: updatedCtf.name,
        bannerUrl: updatedCtf.bannerUrl,
        description: updatedCtf.description
      };
    } else {
      // Create new CTF
      const newCtf = new CtfModel(data);
      const savedCtf = await newCtf.save();
      
      newOrUpdatedCtf = {
        id: (savedCtf as any)._id.toString(),
        slug: savedCtf.slug,
        name: savedCtf.name,
        bannerUrl: savedCtf.bannerUrl,
        description: savedCtf.description
      };
    }
    
    revalidatePath('/admin-page/ctfs');
    revalidatePath('/admin-page');
    revalidatePath(`/ctfs/${newOrUpdatedCtf.slug}`);
    revalidatePath('/');
    return { success: true, message: "CTF saved successfully.", data: newOrUpdatedCtf };
  } catch (error) {
    console.error('Error saving CTF:', error);
    return { success: false, message: "An error occurred while saving the CTF." };
  }
}

export async function deleteCtf(id: string): Promise<ActionResponse<null>> {
  try {
    await connectToDatabase();
    
    // Delete from MongoDB
    const deletedCtf = await CtfModel.findByIdAndDelete(id);
    if (!deletedCtf) {
      return { success: false, message: "CTF not found." };
    }

    revalidatePath('/admin-page/ctfs');
    revalidatePath('/admin-page');
    revalidatePath('/');
    return { success: true, message: "CTF deleted successfully." };
  } catch(error) {
    console.error('Error deleting CTF:', error);
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
    await connectToDatabase();

    if (id) {
      // Update existing member
      const updatedMember = await TeamMemberModel.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      );
      
      if (!updatedMember) {
        return { success: false, message: "Member not found." };
      }
      
      newOrUpdatedMember = {
        id: (updatedMember as any)._id.toString(),
        name: updatedMember.name,
        handle: updatedMember.handle,
        role: updatedMember.role,
        avatarUrl: updatedMember.avatarUrl
      };
    } else {
      // Create new member
      const newMember = new TeamMemberModel(data);
      const savedMember = await newMember.save();
      
      newOrUpdatedMember = {
        id: (savedMember as any)._id.toString(),
        name: savedMember.name,
        handle: savedMember.handle,
        role: savedMember.role,
        avatarUrl: savedMember.avatarUrl
      };
    }
    
    revalidatePath('/admin-page/members');
    revalidatePath('/admin-page');
    revalidatePath('/members');
    return { success: true, message: "Member saved successfully.", data: newOrUpdatedMember };
  } catch (error) {
    console.error('Error saving member:', error);
    return { success: false, message: "An error occurred while saving the member." };
  }
}

export async function deleteMember(id: string): Promise<ActionResponse<null>> {
   try {
    await connectToDatabase();
    
    // Delete from MongoDB
    const deletedMember = await TeamMemberModel.findByIdAndDelete(id);
    if (!deletedMember) {
      return { success: false, message: "Member not found." };
    }

    revalidatePath('/admin-page/members');
    revalidatePath('/admin-page');
    revalidatePath('/members');
    return { success: true, message: "Member deleted successfully." };
  } catch(error) {
    console.error('Error deleting member:', error);
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
    await connectToDatabase();

    if (id) {
      // Update existing challenge
      const updatedChallenge = await ChallengeModel.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      );
      
      if (!updatedChallenge) {
        return { success: false, message: "Challenge not found." };
      }
      
      newOrUpdatedChallenge = {
        id: (updatedChallenge as any)._id.toString(),
        ctfId: updatedChallenge.ctfId.toString(),
        title: updatedChallenge.title,
        category: updatedChallenge.category,
        description: updatedChallenge.description,
        writeup: updatedChallenge.writeup,
        imageUrl: updatedChallenge.imageUrl
      };
    } else {
      // Create new challenge
      const newChallenge = new ChallengeModel(data);
      const savedChallenge = await newChallenge.save();
      
      newOrUpdatedChallenge = {
        id: (savedChallenge as any)._id.toString(),
        ctfId: savedChallenge.ctfId.toString(),
        title: savedChallenge.title,
        category: savedChallenge.category,
        description: savedChallenge.description,
        writeup: savedChallenge.writeup,
        imageUrl: savedChallenge.imageUrl
      };
    }
    
    // Get CTF for revalidation
    const ctf = await CtfModel.findById(newOrUpdatedChallenge.ctfId);
    
    revalidatePath('/admin-page/writeups');
    revalidatePath('/admin-page');
    if (ctf) {
      revalidatePath(`/ctfs/${ctf.slug}`);
    }
    return { success: true, message: "Challenge saved successfully.", data: newOrUpdatedChallenge };
  } catch (error) {
    console.error('Error saving challenge:', error);
    return { success: false, message: "An error occurred while saving the challenge." };
  }
}


export async function deleteChallenge(id: string): Promise<ActionResponse<null>> {
   try {
    await connectToDatabase();
    
    // Get challenge before deleting to find associated CTF
    const challenge = await ChallengeModel.findById(id);
    if (!challenge) {
      return { success: false, message: "Challenge not found." };
    }

    const ctf = await CtfModel.findById(challenge.ctfId);

    // Delete from MongoDB
    await ChallengeModel.findByIdAndDelete(id);

    revalidatePath('/admin-page/writeups');
    revalidatePath('/admin-page');
    if (ctf) {
      revalidatePath(`/ctfs/${ctf.slug}`);
    }
    return { success: true, message: "Challenge deleted successfully." };
  } catch(error) {
    console.error('Error deleting challenge:', error);
    return { success: false, message: "An error occurred." };
  }
}
