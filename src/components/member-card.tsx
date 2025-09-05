import type { TeamMember } from '@/lib/definitions';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Instagram, Twitter, Github, Linkedin, Mail, Globe } from 'lucide-react';
import Link from 'next/link';

const socialIcons = {
  instagram: { icon: Instagram, color: 'text-pink-500 hover:text-pink-600' },
  twitter: { icon: Twitter, color: 'text-blue-400 hover:text-blue-500' },
  github: { icon: Github, color: 'text-gray-400 hover:text-gray-300' },
  linkedin: { icon: Linkedin, color: 'text-blue-600 hover:text-blue-700' },
  email: { icon: Mail, color: 'text-red-500 hover:text-red-600' },
  website: { icon: Globe, color: 'text-green-500 hover:text-green-600' },
};

export function MemberCard({ member }: { member: TeamMember }) {
  const activeSocials = Object.entries(member.social || {}).filter(([_, url]) => url && url.trim() !== '');
  
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
        <p className="mt-2 text-sm text-muted-foreground">{member.role}</p>
        
        {/* Social Media Icons */}
        {activeSocials.length > 0 && (
          <div className="flex justify-center gap-3 mt-4">
            {activeSocials.map(([platform, url]) => {
              const socialConfig = socialIcons[platform as keyof typeof socialIcons];
              if (!socialConfig) return null;
              
              const Icon = socialConfig.icon;
              const href = platform === 'email' ? `mailto:${url}` : url;
              
              return (
                <Link
                  key={platform}
                  href={href}
                  target={platform !== 'email' ? '_blank' : undefined}
                  rel={platform !== 'email' ? 'noopener noreferrer' : undefined}
                  className={`transition-colors duration-200 ${socialConfig.color}`}
                  title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
