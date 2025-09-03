import { teamMembers } from '@/lib/data';
import { MemberCard } from '@/components/member-card';

export default function MembersPage() {
  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Meet the Team</h1>
        <p className="mt-4 text-lg text-muted-foreground">The minds behind the hacks. We are r00t_R3b3lz.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
