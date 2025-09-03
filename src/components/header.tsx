import Link from 'next/link';
import { Terminal } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 px-4 md:px-6 relative z-50">
      <div className="container mx-auto flex items-center justify-center">
        {/* Rounded navigation bar similar to React Bits */}
        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-full px-8 py-4 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group" prefetch={false}>
            <Terminal className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-lg font-bold font-code text-white">
              r00t<span className="text-primary group-hover:glow transition-shadow duration-300">_</span>R3b3lz
            </span>
          </Link>
          
          <div className="h-6 w-px bg-white/20"></div>
          
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/10"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="/members"
              className="text-white/80 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/10"
              prefetch={false}
            >
              Members
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
