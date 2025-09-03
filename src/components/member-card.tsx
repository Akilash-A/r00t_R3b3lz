import type { TeamMember } from '@/lib/definitions';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function MemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="text-center transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 hover:border-primary/30">
      <CardContent className="pt-8">
        <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-primary ring-4 ring-primary/20 transition-all duration-200">
          <AvatarImage 
            src={member.avatarUrl} 
            alt={member.name} 
            loading="lazy"
          />
          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-bold">{member.name}</h3>
        <p className="text-primary font-code">{member.handle}</p>
        <p className="mt-2 text-sm text-muted-foreground">{member.role}</p>
      </CardContent>
    </Card>
  );
}
