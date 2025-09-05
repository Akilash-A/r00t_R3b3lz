import mongoose, { Schema, Document } from 'mongoose';

// Interface definitions for TypeScript
export interface ICtf extends Document {
  slug: string;
  name: string;
  bannerUrl: string;
  description: string;
}

export interface IChallenge extends Document {
  ctfId: mongoose.Types.ObjectId;
  title: string;
  category: 'Web' | 'Pwn' | 'Crypto' | 'Misc' | 'Rev' | 'OSINT';
  description: string;
  writeup: string;
  imageUrl?: string;
}

export interface ITeamMember extends Document {
  name: string;
  social: {
    instagram?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    email?: string;
    website?: string;
  };
  role: string;
  avatarUrl: string;
}

// CTF Schema
const CtfSchema = new Schema<ICtf>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  description: { type: String, required: true }
}, {
  timestamps: true
});

// Challenge Schema
const ChallengeSchema = new Schema<IChallenge>({
  ctfId: { type: Schema.Types.ObjectId, ref: 'Ctf', required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Web', 'Pwn', 'Crypto', 'Misc', 'Rev', 'OSINT']
  },
  description: { type: String, required: true },
  writeup: { type: String, required: true },
  imageUrl: { type: String }
}, {
  timestamps: true
});

// Team Member Schema
const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  social: {
    instagram: { type: String },
    twitter: { type: String },
    github: { type: String },
    linkedin: { type: String },
    email: { type: String },
    website: { type: String }
  },
  role: { type: String, required: true },
  avatarUrl: { type: String, default: '' }
}, {
  timestamps: true
});

// Create or use existing models - check if models object exists first
let CtfModel: mongoose.Model<ICtf>;
let ChallengeModel: mongoose.Model<IChallenge>;
let TeamMemberModel: mongoose.Model<ITeamMember>;

try {
  CtfModel = mongoose.model<ICtf>('Ctf');
} catch {
  CtfModel = mongoose.model<ICtf>('Ctf', CtfSchema);
}

try {
  ChallengeModel = mongoose.model<IChallenge>('Challenge');
} catch {
  ChallengeModel = mongoose.model<IChallenge>('Challenge', ChallengeSchema);
}

try {
  TeamMemberModel = mongoose.model<ITeamMember>('TeamMember');
} catch {
  TeamMemberModel = mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
}

export { CtfModel, ChallengeModel, TeamMemberModel };
