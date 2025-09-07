'use client';

import Link from 'next/link';
import { Terminal } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  // Handle hash scrolling after navigation
  useEffect(() => {
    if (pathname === '/' && window.location.hash === '#ctf-writeups') {
      setTimeout(() => {
        const element = document.getElementById('ctf-writeups');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    }
  }, [pathname]);

  const handleCtfWriteupsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate to home first
    if (pathname !== '/') {
      router.push('/#ctf-writeups');
      return;
    }
    
    // If we're already on home page, just scroll
    const element = document.getElementById('ctf-writeups');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate to home first
    if (pathname !== '/') {
      router.push('/');
      return;
    }
    
    // If we're already on home page, just scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleMembersClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push('/members');
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="flex justify-center">
        <div 
          className="flex items-center justify-between w-full max-w-4xl px-8 py-5 bg-black/5 backdrop-blur-2xl rounded-full border"
          style={{ borderColor: 'rgb(54, 63, 81)' }}
          suppressHydrationWarning
        >
          <Link href="/" className="flex items-center gap-2 group" prefetch={true}>
            <Terminal className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" suppressHydrationWarning />
            <span className="text-lg font-bold font-code text-white">
              r00t<span className="text-primary group-hover:glow transition-shadow duration-300">_</span>R3b3lz
            </span>
          </Link>
          
          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="text-white/80 hover:text-white transition-colors px-3 py-2 hover:bg-white/10 rounded-[20px]"
              prefetch={true}
            >
              Home
            </Link>
            <Link
              href="/#ctf-writeups"
              onClick={handleCtfWriteupsClick}
              className="text-white/80 hover:text-white transition-colors px-3 py-2 hover:bg-white/10 rounded-[20px]"
              prefetch={true}
            >
              CTF-Writeups
            </Link>
            <Link
              href="/members"
              onClick={handleMembersClick}
              className="text-white/80 hover:text-white transition-colors px-3 py-2 hover:bg-white/10 rounded-[20px]"
              prefetch={true}
            >
              Members
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
