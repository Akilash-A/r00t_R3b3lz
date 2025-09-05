import connectToDatabase from '../src/lib/mongodb';
import { TeamMemberModel } from '../src/lib/models';

async function migrateMemberData() {
  try {
    await connectToDatabase();
    console.log('Connected to database');

    // Get all members
    const members = await TeamMemberModel.find({});
    console.log(`Found ${members.length} members to check`);

    for (const member of members) {
      let needsUpdate = false;
      const updateData: any = {};

      // Check if member has old 'handle' field and convert to social
      if ((member as any).handle && !member.social) {
        updateData.social = {
          instagram: '',
          twitter: (member as any).handle || '',
          github: '',
          linkedin: '',
          email: '',
          website: ''
        };
        needsUpdate = true;
        console.log(`Converting handle "${(member as any).handle}" to social for ${member.name}`);
      }

      // Ensure social object has all required fields
      if (member.social && typeof member.social === 'object') {
        const requiredFields = ['instagram', 'twitter', 'github', 'linkedin', 'email', 'website'];
        const currentSocial = member.social as any;
        const updatedSocial = { ...currentSocial };
        
        for (const field of requiredFields) {
          if (!updatedSocial[field]) {
            updatedSocial[field] = '';
          }
        }
        
        if (JSON.stringify(currentSocial) !== JSON.stringify(updatedSocial)) {
          updateData.social = updatedSocial;
          needsUpdate = true;
          console.log(`Updating social fields for ${member.name}`);
        }
      }

      // Ensure avatarUrl has a default value
      if (!member.avatarUrl) {
        updateData.avatarUrl = '/placeholder-avatar.svg';
        needsUpdate = true;
        console.log(`Setting default avatar for ${member.name}`);
      }

      // Apply updates if needed
      if (needsUpdate) {
        await TeamMemberModel.findByIdAndUpdate(member._id, updateData);
        console.log(`Updated member: ${member.name}`);
      }

      // Remove old handle field if it exists
      if ((member as any).handle) {
        await TeamMemberModel.findByIdAndUpdate(member._id, { $unset: { handle: 1 } });
        console.log(`Removed handle field for ${member.name}`);
      }
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateMemberData();
