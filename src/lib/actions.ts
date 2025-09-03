'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const USERNAME = 'T3chC0brA';
const PASSWORD = 'T3chC0brAT3chC0brA@';
const COOKIE_NAME = 'r00t-r3b3lz-auth';

export async function authenticate(_prevState: string | undefined, formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  if (username === USERNAME && password === PASSWORD) {
    cookies().set(COOKIE_NAME, 'true', { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
    redirect('/admin-page');
  }

  return 'Invalid username or password. Please try again.';
}

export async function logout() {
  cookies().delete(COOKIE_NAME);
  redirect('/login');
}

// These are placeholder actions. In a real application, you would interact with a database.
export async function addWriteup(formData: FormData) {
  // TODO: Implement actual data mutation
  console.log('Adding writeup:', Object.fromEntries(formData.entries()));
  // In a real app, you'd revalidate the path:
  // revalidatePath('/');
  // revalidatePath('/ctfs/[slug]');
}

export async function addMember(formData: FormData) {
  // TODO: Implement actual data mutation
  console.log('Adding member:', Object.fromEntries(formData.entries()));
  // In a real app, you'd revalidate the path:
  // revalidatePath('/members');
}
