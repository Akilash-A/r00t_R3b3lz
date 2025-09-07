"use client";

import type { TeamMember } from '@/lib/definitions';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Instagram, Twitter, Github, Linkedin, Mail, Globe } from 'lucide-react';
import Link from 'next/link';
import React, { useRef, useCallback, useEffect } from 'react';

const socialIcons = {
  instagram: { icon: Instagram, color: 'text-pink-500 hover:text-pink-600' },
  twitter: { icon: Twitter, color: 'text-blue-400 hover:text-blue-500' },
  github: { icon: Github, color: 'text-gray-400 hover:text-gray-300' },
  linkedin: { icon: Linkedin, color: 'text-blue-600 hover:text-blue-700' },
  email: { icon: Mail, color: 'text-red-500 hover:text-red-600' },
  website: { icon: Globe, color: 'text-green-500 hover:text-green-600' },
};

const clamp = (value: number, min = 0, max = 100): number => Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3): number => parseFloat(value.toFixed(precision));

export function MemberCard({ member }: { member: TeamMember }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const activeSocials = Object.entries(member.social || {}).filter(([_, url]) => url && url.trim() !== '');

  const updateCardTransform = useCallback((offsetX: number, offsetY: number) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    
    if (!card || !wrap) return;

    const width = card.clientWidth;
    const height = card.clientHeight;

    const percentX = clamp((100 / width) * offsetX);
    const percentY = clamp((100 / height) * offsetY);

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const rotateX = round(-(centerX / 8));
    const rotateY = round(centerY / 6);

    wrap.style.setProperty('--pointer-x', `${percentX}%`);
    wrap.style.setProperty('--pointer-y', `${percentY}%`);
    wrap.style.setProperty('--rotate-x', `${rotateX}deg`);
    wrap.style.setProperty('--rotate-y', `${rotateY}deg`);
    wrap.style.setProperty('--pointer-from-center', `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    const card = cardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    updateCardTransform(event.clientX - rect.left, event.clientY - rect.top);
  }, [updateCardTransform]);

  const handlePointerEnter = useCallback(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    
    if (!wrap || !card) return;
    
    wrap.classList.add('active');
    card.classList.add('active');
    
    // Disable transition during hover for immediate response
    card.style.transition = 'none';
  }, []);

  const handlePointerLeave = useCallback(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    
    if (!wrap || !card) return;
    
    wrap.classList.remove('active');
    card.classList.remove('active');
    
    // Re-enable smooth transition for reset
    card.style.transition = 'transform 0.6s ease, box-shadow 0.6s ease';
    
    // Reset transform smoothly
    wrap.style.setProperty('--rotate-x', '0deg');
    wrap.style.setProperty('--rotate-y', '0deg');
    wrap.style.setProperty('--pointer-x', '50%');
    wrap.style.setProperty('--pointer-y', '50%');
    wrap.style.setProperty('--pointer-from-center', '0');
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Initialize CSS variables
    wrap.style.setProperty('--pointer-x', '50%');
    wrap.style.setProperty('--pointer-y', '50%');
    wrap.style.setProperty('--rotate-x', '0deg');
    wrap.style.setProperty('--rotate-y', '0deg');
    wrap.style.setProperty('--pointer-from-center', '0');
  }, []);
  
  return (
    <div 
      ref={wrapRef}
      className="perspective-500 transform-gpu"
      style={{
        perspective: '500px',
        transformStyle: 'preserve-3d'
      }}
    >
      <Card 
        ref={cardRef}
        className="text-center transition-all duration-300 hover:-translate-y-2 group relative overflow-visible border-transparent h-80 transform-gpu"
        style={{
          transform: 'translate3d(0, 0, 0.1px) rotateX(var(--rotate-y, 0deg)) rotateY(var(--rotate-x, 0deg))',
          transition: 'transform 0.6s ease',
          boxShadow: 'rgba(0, 0, 0, 0.4) calc((var(--pointer-from-center, 0) * 10px) - 3px) calc((var(--pointer-from-center, 0) * 20px) - 6px) 20px -5px'
        }}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {/* Outer glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -m-1"
          style={{
            background: `radial-gradient(farthest-side circle at var(--pointer-x, 50%) var(--pointer-y, 50%), hsla(266, 100%, 90%, var(--pointer-from-center, 0)) 4%, hsla(266, 50%, 80%, calc(var(--pointer-from-center, 0) * 0.75)) 10%, hsla(266, 25%, 70%, calc(var(--pointer-from-center, 0) * 0.5)) 50%, hsla(266, 0%, 60%, 0) 100%)`
          }}
        >
          <div className="absolute inset-0 rounded-[25px] bg-gradient-to-r from-blue-500/20 via-cyan-400/30 to-blue-500/20 blur-sm"></div>
          <div className="absolute inset-0 rounded-[25px] bg-gradient-to-r from-blue-400/40 via-cyan-300/50 to-blue-400/40 blur-md"></div>
          <div className="absolute inset-0 rounded-[25px] bg-gradient-to-r from-blue-300/20 via-cyan-200/30 to-blue-300/20 blur-lg"></div>
        </div>
      
      {/* Card border glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-[25px] border-2 border-blue-400/80 shadow-[0_0_25px_rgba(59,130,246,0.8),0_0_50px_rgba(59,130,246,0.4),0_0_75px_rgba(59,130,246,0.2)]"></div>
      </div>
      
      {/* Card content with subtle background */}
      <div className="relative z-10 rounded-[25px] bg-gradient-to-br from-slate-900/95 to-slate-800/95 group-hover:from-blue-950/90 group-hover:to-slate-900/90 transition-all duration-500 backdrop-blur-sm h-full border border-slate-700/50 group-hover:border-blue-400/30">
        <CardContent className="pt-8 h-full flex flex-col justify-center relative">
          {/* Inner background overlay */}
          <div className="absolute inset-1 rounded-[23px] bg-gradient-to-br from-slate-800/60 to-slate-900/80 group-hover:from-blue-900/40 group-hover:to-slate-800/60 transition-all duration-500"></div>
          
          <div className="relative z-10">
            <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-primary ring-4 ring-primary/20 transition-all duration-300 group-hover:ring-blue-400/60 group-hover:border-blue-400/80 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]">
            <AvatarImage 
              src={member.avatarUrl} 
              alt={member.name} 
              loading="lazy"
            />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
        <h3 className="text-xl font-bold group-hover:text-blue-100 transition-colors duration-300">{member.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground group-hover:text-blue-200 transition-colors duration-300">{member.role}</p>
        
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
                  className={`transition-all duration-300 ${socialConfig.color} group-hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]`}
                  title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </CardContent>
      </div>
    </Card>
    </div>
  );
}
