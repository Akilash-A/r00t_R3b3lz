import type { Ctf, Challenge, TeamMember } from './definitions';
import connectToDatabase from './mongodb';
import { CtfModel, ChallengeModel, TeamMemberModel } from './models';

// Database functions
export async function getCtfsFromDB(): Promise<Ctf[]> {
  try {
    await connectToDatabase();
    const ctfs = await CtfModel.find({}).sort({ createdAt: -1 }).lean();
    return ctfs.map((ctf: any) => ({
      id: ctf._id.toString(),
      slug: ctf.slug,
      name: ctf.name,
      bannerUrl: ctf.bannerUrl,
      description: ctf.description
    }));
  } catch (error) {
    console.error('Error fetching CTFs from database:', error);
    return defaultCtfs;
  }
}

export async function getChallengesFromDB(): Promise<Challenge[]> {
  try {
    await connectToDatabase();
    
    // First, clean up any orphaned challenges (challenges with null or invalid ctfId)
    await ChallengeModel.deleteMany({ 
      $or: [
        { ctfId: null },
        { ctfId: { $exists: false } }
      ]
    });
    
    const challenges = await ChallengeModel.find({}).populate('ctfId').sort({ createdAt: -1 }).lean();
    
    // Filter out challenges with null or missing ctfId and map the valid ones
    return challenges
      .filter((challenge: any) => challenge.ctfId && challenge._id)
      .map((challenge: any) => ({
        id: challenge._id.toString(),
        ctfId: challenge.ctfId._id ? challenge.ctfId._id.toString() : challenge.ctfId.toString(),
        title: challenge.title,
        category: challenge.category,
        description: challenge.description,
        writeup: challenge.writeup,
        imageUrl: challenge.imageUrl
      }));
  } catch (error) {
    console.error('Error fetching challenges from database:', error);
    return defaultChallenges;
  }
}

export async function getTeamMembersFromDB(): Promise<TeamMember[]> {
  try {
    await connectToDatabase();
    const members = await TeamMemberModel.find({}).sort({ createdAt: 1 }).lean();
    
    // Explicitly serialize to ensure no MongoDB methods remain
    return JSON.parse(JSON.stringify(members.map((member: any) => {
      // Ensure we only return plain objects with the expected structure
      const socialData = member.social || {};
      
      return {
        id: member._id.toString(),
        name: String(member.name || ''),
        social: {
          instagram: String(socialData.instagram || ''),
          twitter: String(socialData.twitter || ''),
          github: String(socialData.github || ''),
          linkedin: String(socialData.linkedin || ''),
          email: String(socialData.email || ''),
          website: String(socialData.website || '')
        },
        role: String(member.role || ''),
        avatarUrl: String(member.avatarUrl || '/placeholder-avatar.svg')
      };
    })));
  } catch (error) {
    console.error('Error fetching team members from database:', error);
    return defaultTeamMembers;
  }
}

// Fallback data for development/demo purposes
export const defaultCtfs: Ctf[] = [
  {
    id: '1',
    slug: 'functf-2024',
    name: 'FuncTF 2024',
    bannerUrl: 'https://picsum.photos/1200/400',
    description: 'A beginner-friendly CTF with a variety of challenges.',
  },
  {
    id: '2',
    slug: 'securinets-ctf-2023',
    name: 'Securinets CTF 2023',
    bannerUrl: 'https://picsum.photos/1200/401',
    description: 'A competitive CTF focused on advanced pwn and web exploitation.',
  },
  {
    id: '3',
    slug: 'cybertalents-ctf-2023',
    name: 'CyberTalents CTF 2023',
    bannerUrl: 'https://picsum.photos/1200/402',
    description: 'A jeopardy-style CTF covering all major security categories.',
  },
];

export const defaultChallenges: Challenge[] = [
  // FuncTF 2024 Challenges
  {
    id: '101',
    ctfId: '1',
    title: 'Web Warmup',
    category: 'Web',
    description: 'A simple challenge to get you started with web exploitation.',
    writeup: `
# Web Warmup Write-up

This was a straightforward challenge. The goal was to find a hidden flag on the page.

1.  **Initial Recon:** I inspected the page source (Ctrl+U).
2.  **Finding Comments:** I looked for HTML comments and found one that contained a base64 encoded string.
3.  **Decoding:** I decoded the string using an online tool, which revealed the flag.

Flag: \`functf{w3b_is_fun}\`
    `,
  },
  {
    id: '102',
    ctfId: '1',
    title: 'Login Bypass',
    category: 'Web',
    description: 'Bypass the login form to get the flag.',
    writeup: `
# Login Bypass Write-up

The login form was vulnerable to a classic SQL injection.

1.  **Testing Injection:** I tried common SQLi payloads in the username field.
2.  **Successful Payload:** The payload \`' OR '1'='1\` worked.
3.  **Access Granted:** This bypassed the authentication and logged me in as the admin, where the flag was displayed.

Flag: \`functf{sql_injection_ftw}\`
    `,
  },
  {
    id: '103',
    ctfId: '1',
    title: 'RSA Basics',
    category: 'Crypto',
    description: 'A simple RSA challenge with small primes.',
    writeup: `
# RSA Basics Write-up

The challenge provided N, e, and the ciphertext c.

1.  **Factoring N:** Since N was small, I used an online tool (like Factordb) to find the prime factors p and q.
2.  **Calculating Phi:** I calculated phi(n) = (p-1) * (q-1).
3.  **Finding Private Key:** I calculated the private key d, which is the modular multiplicative inverse of e modulo phi(n).
4.  **Decrypting:** Finally, I decrypted the message using the formula m = c^d mod n.

Flag: \`functf{rsa_is_not_so_h4rd}\`
    `,
  },
  // Securinets CTF 2023 Challenges
  {
    id: '201',
    ctfId: '2',
    title: 'Pwn Me',
    category: 'Pwn',
    description: 'A buffer overflow challenge.',
    writeup: `
# Pwn Me Write-up

This was a classic buffer overflow.

1.  **Finding the Offset:** I used gdb with gef to create a pattern and find the exact offset to overwrite the return address.
2.  **Shellcode:** I used a standard x86_64 shellcode to pop a shell.
3.  **Exploitation:** I crafted the final exploit payload: NOP sled + shellcode + saved EIP overwrite. Running it gave me a shell on the server.

Flag: \`securinets{pwn_all_the_things}\`
    `,
  },
];

export const defaultTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'T3chC0brA',
    social: {
      github: 'https://github.com/techcobra',
      twitter: 'https://x.com/techcobra',
      linkedin: 'https://linkedin.com/in/techcobra',
      email: 'techcobra@example.com'
    },
    role: 'Team Lead & Pwn Expert',
    avatarUrl: 'https://picsum.photos/200/200',
  },
  {
    id: '2',
    name: 'Cryp70K1n9',
    social: {
      github: 'https://github.com/cryp70k1n9',
      twitter: 'https://x.com/cryp70k1n9',
      instagram: 'https://instagram.com/cryp70k1n9'
    },
    role: 'Crypto Specialist',
    avatarUrl: 'https://picsum.photos/201/201',
  },
  {
    id: '3',
    name: 'WebSlinger',
    social: {
      github: 'https://github.com/webslinger',
      linkedin: 'https://linkedin.com/in/webslinger',
      website: 'https://webslinger.dev'
    },
    role: 'Web Exploitation Guru',
    avatarUrl: 'https://picsum.photos/202/202',
  },
  {
    id: '4',
    name: 'RevEngeR',
    social: {
      github: 'https://github.com/revenger',
      twitter: 'https://x.com/revenger',
      email: 'revenger@example.com'
    },
    role: 'Reverse Engineering Pro',
    avatarUrl: 'https://picsum.photos/203/203',
  },
];

// Export live data for backward compatibility
export let ctfs: Ctf[] = defaultCtfs;
export let challenges: Challenge[] = defaultChallenges;
export let teamMembers: TeamMember[] = defaultTeamMembers;
