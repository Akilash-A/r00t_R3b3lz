import connectToDatabase from '../src/lib/mongodb';
import { CtfModel, ChallengeModel, TeamMemberModel } from '../src/lib/models';
import { defaultCtfs, defaultChallenges, defaultTeamMembers } from '../src/lib/data';

async function seedDatabase() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    // Clear existing data
    await CtfModel.deleteMany({});
    await ChallengeModel.deleteMany({});
    await TeamMemberModel.deleteMany({});
    console.log('Cleared existing data');

    // Seed CTFs
    const ctfs = await CtfModel.insertMany(
      defaultCtfs.map(ctf => ({
        slug: ctf.slug,
        name: ctf.name,
        bannerUrl: ctf.bannerUrl,
        description: ctf.description
      }))
    ) as Array<InstanceType<typeof CtfModel>>;
    console.log(`Seeded ${ctfs.length} CTFs`);

    // Create a mapping of old IDs to new MongoDB ObjectIds
    const ctfIdMap: Record<string, string> = {};
    defaultCtfs.forEach((ctf, index) => {
      ctfIdMap[ctf.id] = ctfs[index]._id.toString();
    });

    // Seed Challenges with updated CTF IDs
    const challenges = await ChallengeModel.insertMany(defaultChallenges.map(challenge => ({
      ctfId: ctfs.find(ctf => ctf.slug === defaultCtfs.find(c => c.id === challenge.ctfId)?.slug)?._id,
      title: challenge.title,
      category: challenge.category,
      description: challenge.description,
      writeup: challenge.writeup,
      imageUrl: challenge.imageUrl
    })));
    console.log(`Seeded ${challenges.length} Challenges`);

    // Seed Team Members
    const members = await TeamMemberModel.insertMany(defaultTeamMembers.map(member => ({
      name: member.name,
      handle: member.handle,
      role: member.role,
      avatarUrl: member.avatarUrl
    })));
    console.log(`Seeded ${members.length} Team Members`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
