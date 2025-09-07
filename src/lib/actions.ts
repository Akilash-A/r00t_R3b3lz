'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { ctfSchema, memberSchema, challengeSchema, Ctf, TeamMember, Challenge } from './definitions';
import connectToDatabase from './mongodb';
import { CtfModel, ChallengeModel, TeamMemberModel } from './models';

const USERNAME = 'T3chC0brA';
const PASSWORD = 'T3chC0brAT3chC0brA@';
const COOKIE_NAME = 'r00t-r3b3lz-auth';

// Helper function to delete uploaded images
async function deleteUploadedImage(imageUrl: string) {
  if (!imageUrl) return;
  
  try {
    // Check if it's a local upload path
    if (imageUrl.startsWith('/uploads/')) {
      const filename = imageUrl.split('/uploads/')[1];
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload/delete?filename=${filename}`, {
        method: 'DELETE'
      });
    } else {
      // Handle full URLs
      try {
        const url = new URL(imageUrl);
        if (url.pathname.startsWith('/uploads/')) {
          const filename = url.pathname.split('/uploads/')[1];
          await fetch(`${url.origin}/api/upload/delete?filename=${filename}`, {
            method: 'DELETE'
          });
        }
      } catch (urlError) {
        // If URL parsing fails, it might be a relative path, try direct filename extraction
        if (imageUrl.includes('/uploads/')) {
          const filename = imageUrl.split('/uploads/')[1];
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload/delete?filename=${filename}`, {
            method: 'DELETE'
          });
        }
      }
    }
  } catch (error) {
    console.error('Error deleting uploaded image:', error);
  }
}

// Helper function to finalize temporary upload and delete old image
async function finalizeImageUpload(tempImageUrl: string, oldImageUrl?: string): Promise<string | null> {
  if (!tempImageUrl) return null;
  
  try {
    // Check if it's a temporary upload
    if (tempImageUrl.includes('/uploads/temp/')) {
      const tempFilename = tempImageUrl.split('/uploads/temp/')[1];
      const finalFilename = tempFilename.replace('temp_', '');
      
      // Extract old filename if exists
      let oldFilename = null;
      if (oldImageUrl && oldImageUrl.includes('/uploads/')) {
        oldFilename = oldImageUrl.split('/uploads/')[1];
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload/finalize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tempFilename,
          finalFilename,
          deleteOldFile: oldFilename
        })
      });
      
      const result = await response.json();
      if (result.success) {
        return result.url;
      }
    }
    
    return tempImageUrl;
  } catch (error) {
    console.error('Error finalizing image upload:', error);
    return tempImageUrl;
  }
}

// Helper function to cleanup temporary file if form submission fails
async function cleanupTempImage(imageUrl: string) {
  if (!imageUrl || !imageUrl.includes('/uploads/temp/')) return;
  
  try {
    const tempFilename = imageUrl.split('/uploads/temp/')[1];
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload/temp/cleanup?filename=${tempFilename}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error cleaning up temp image:', error);
  }
}

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

    // Get existing CTF data if updating
    let existingCtf = null;
    if (id) {
      existingCtf = await CtfModel.findById(id);
      if (!existingCtf) {
        return { success: false, message: "CTF not found." };
      }
    }

    // Finalize banner image upload and handle old image deletion
    const finalBannerUrl = await finalizeImageUpload(
      data.bannerUrl,
      existingCtf?.bannerUrl
    );

    // Update data with finalized banner URL
    const finalData = {
      ...data,
      bannerUrl: finalBannerUrl || data.bannerUrl
    };

    if (id) {
      // Update existing CTF
      const updatedCtf = await CtfModel.findByIdAndUpdate(
        id,
        finalData,
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
      const newCtf = new CtfModel(finalData);
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
    
    // Clean up temp image if form submission failed
    if (data.bannerUrl) {
      await cleanupTempImage(data.bannerUrl);
    }
    
    return { success: false, message: "An error occurred while saving the CTF." };
  }
}

export async function deleteCtf(id: string): Promise<ActionResponse<null>> {
  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, message: "Invalid CTF ID. This CTF cannot be deleted from the database." };
    }

    await connectToDatabase();
    
    // Get CTF details before deleting to clean up images
    const ctf = await CtfModel.findById(id);
    if (!ctf) {
      return { success: false, message: "CTF not found." };
    }

    // Delete all challenges associated with this CTF and their images
    const challenges = await ChallengeModel.find({ ctfId: id });
    for (const challenge of challenges) {
      if (challenge.imageUrl) {
        await deleteUploadedImage(challenge.imageUrl);
      }
    }
    await ChallengeModel.deleteMany({ ctfId: id });

    // Delete CTF banner image
    if (ctf.bannerUrl) {
      await deleteUploadedImage(ctf.bannerUrl);
    }

    // Delete the CTF itself
    await CtfModel.findByIdAndDelete(id);

    revalidatePath('/admin-page/ctfs');
    revalidatePath('/admin-page');
    revalidatePath('/admin-page/writeups');
    revalidatePath('/');
    return { success: true, message: "CTF and all associated data deleted successfully." };
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

  try {
    await connectToDatabase();

    // Get existing member data if updating
    let existingMember = null;
    if (id) {
      existingMember = await TeamMemberModel.findById(id);
      if (!existingMember) {
        return { success: false, message: "Member not found." };
      }
    }

    // Finalize avatar image upload and handle old image deletion
    const finalAvatarUrl = await finalizeImageUpload(
      data.avatarUrl || '',
      existingMember?.avatarUrl
    );

    // Ensure avatarUrl has a default value if empty
    const memberData = {
      ...data,
      avatarUrl: finalAvatarUrl || data.avatarUrl || '/placeholder-avatar.svg'
    };
    
    let newOrUpdatedMember: TeamMember;

    if (id) {
      // Update existing member
      const updatedMember = await TeamMemberModel.findByIdAndUpdate(
        id,
        memberData,
        { new: true, runValidators: true }
      );
      
      if (!updatedMember) {
        return { success: false, message: "Member not found." };
      }
      
      newOrUpdatedMember = {
        id: (updatedMember as any)._id.toString(),
        name: String(updatedMember.name),
        social: {
          instagram: String(updatedMember.social?.instagram || ''),
          twitter: String(updatedMember.social?.twitter || ''),
          github: String(updatedMember.social?.github || ''),
          linkedin: String(updatedMember.social?.linkedin || ''),
          email: String(updatedMember.social?.email || ''),
          website: String(updatedMember.social?.website || '')
        },
        role: String(updatedMember.role),
        avatarUrl: String(updatedMember.avatarUrl)
      };
    } else {
      // Create new member
      const newMember = new TeamMemberModel(memberData);
      const savedMember = await newMember.save();
      
      newOrUpdatedMember = {
        id: (savedMember as any)._id.toString(),
        name: String(savedMember.name),
        social: {
          instagram: String(savedMember.social?.instagram || ''),
          twitter: String(savedMember.social?.twitter || ''),
          github: String(savedMember.social?.github || ''),
          linkedin: String(savedMember.social?.linkedin || ''),
          email: String(savedMember.social?.email || ''),
          website: String(savedMember.social?.website || '')
        },
        role: String(savedMember.role),
        avatarUrl: String(savedMember.avatarUrl)
      };
    }
    
    revalidatePath('/admin-page/members');
    revalidatePath('/admin-page');
    revalidatePath('/members');
    
    // Ensure the returned data is completely serialized
    const serializedMember = JSON.parse(JSON.stringify(newOrUpdatedMember));
    return { success: true, message: "Member saved successfully.", data: serializedMember };
  } catch (error) {
    console.error('Error saving member:', error);
    
    // Clean up temp image if form submission failed
    if (data.avatarUrl) {
      await cleanupTempImage(data.avatarUrl);
    }
    
    return { success: false, message: "An error occurred while saving the member." };
  }
}

export async function deleteMember(id: string): Promise<ActionResponse<null>> {
   try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, message: "Invalid member ID. This member cannot be deleted from the database." };
    }

    await connectToDatabase();
    
    // Get member details before deleting to clean up avatar image
    const member = await TeamMemberModel.findById(id);
    if (!member) {
      return { success: false, message: "Member not found." };
    }

    // Delete avatar image if it exists
    if (member.avatarUrl) {
      await deleteUploadedImage(member.avatarUrl);
    }

    // Delete from MongoDB
    await TeamMemberModel.findByIdAndDelete(id);

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

    // Get existing challenge data if updating
    let existingChallenge = null;
    if (id) {
      existingChallenge = await ChallengeModel.findById(id);
      if (!existingChallenge) {
        return { success: false, message: "Challenge not found." };
      }
    }

    // Finalize image upload and handle old image deletion
    const finalImageUrl = await finalizeImageUpload(
      data.imageUrl || '',
      existingChallenge?.imageUrl
    );

    // Update data with finalized image URL
    const finalData = {
      ...data,
      imageUrl: finalImageUrl || data.imageUrl
    };

    if (id) {
      // Update existing challenge
      const updatedChallenge = await ChallengeModel.findByIdAndUpdate(
        id,
        finalData,
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
      const newChallenge = new ChallengeModel(finalData);
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
    
    // Clean up temp image if form submission failed
    if (data.imageUrl) {
      await cleanupTempImage(data.imageUrl);
    }
    
    return { success: false, message: "An error occurred while saving the challenge." };
  }
}


export async function deleteChallenge(id: string): Promise<ActionResponse<null>> {
   try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, message: "Invalid challenge ID. This challenge cannot be deleted from the database." };
    }

    await connectToDatabase();
    
    // Get challenge before deleting to find associated CTF and clean up images
    const challenge = await ChallengeModel.findById(id);
    if (!challenge) {
      return { success: false, message: "Challenge not found." };
    }

    const ctf = await CtfModel.findById(challenge.ctfId);

    // Delete challenge image if it exists
    if (challenge.imageUrl) {
      await deleteUploadedImage(challenge.imageUrl);
    }

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

// Cleanup function to remove orphaned challenges
export async function cleanupOrphanedChallenges(): Promise<ActionResponse<null>> {
  try {
    await connectToDatabase();
    
    // Remove challenges with null or missing ctfId
    const result = await ChallengeModel.deleteMany({ 
      $or: [
        { ctfId: null },
        { ctfId: { $exists: false } }
      ]
    });
    
    // Remove challenges that reference non-existent CTFs
    const allChallenges = await ChallengeModel.find({});
    let orphanedCount = 0;
    
    for (const challenge of allChallenges) {
      if (challenge.ctfId) {
        const ctfExists = await CtfModel.findById(challenge.ctfId);
        if (!ctfExists) {
          await ChallengeModel.findByIdAndDelete(challenge._id);
          orphanedCount++;
        }
      }
    }
    
    const totalDeleted = result.deletedCount + orphanedCount;
    
    revalidatePath('/admin-page/writeups');
    revalidatePath('/admin-page');
    return { 
      success: true, 
      message: `Cleanup completed. Removed ${totalDeleted} orphaned challenges.` 
    };
  } catch (error) {
    console.error('Error cleaning up orphaned challenges:', error);
    return { success: false, message: "An error occurred during cleanup." };
  }
}
