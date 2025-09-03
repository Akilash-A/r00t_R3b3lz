import type { TeamMember } from '@/lib/definitions';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function MemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-primary">
          <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="hacker portrait" />
          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
        <CardDescription className="text-primary">{member.handle}</CardDescription>
        <p className="mt-2 text-sm text-muted-foreground">{member.role}</p>
      </CardContent>
    </Card>
  );
}
