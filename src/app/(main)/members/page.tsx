import { getTeamMembersFromDB } from '@/lib/data';
import { MemberCard } from '@/components/member-card';
import Cubes from '@/components/Cubes';

// Add metadata for better SEO and performance
export const metadata = {
  title: 'Team Members - r00t_R3b3lz',
  description: 'Meet our CTF team members',
};

export default async function MembersPage() {
  const teamMembers = await getTeamMembersFromDB();
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#060010' }}>
      {/* Background Cubes */}
      <div style={{ 
        position: 'fixed', 
        top: '10px',
        left: '10px',
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'auto'
      }}>
        <Cubes 
          gridSize={25}
          cubeSize={40}
          maxAngle={38}
          radius={4}
          cellGap={35}
          borderStyle="2px dashed #b19eef"
          faceColor="#070010"
          rippleColor="#ffffffff"
          rippleSpeed={1.5}
          autoAnimate={true}
          rippleOnClick={true}
        />
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto py-16 md:py-24 px-4 pt-28 md:pt-32" style={{ zIndex: 10, pointerEvents: 'none' }}>
        <div className="text-center mb-16 bg-black/40 backdrop-blur-sm p-6 max-w-3xl mx-auto" style={{ pointerEvents: 'auto', borderRadius: '20px' }}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Meet the Team</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            The minds behind the hacks. A collective of passionate security researchers and CTF enthusiasts.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" style={{ pointerEvents: 'auto' }}>
          {teamMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
