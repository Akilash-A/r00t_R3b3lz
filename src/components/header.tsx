import Link from 'next/link';
import { Terminal } from 'lucide-react';

export function Header() {
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
              className="text-white/80 hover:text-white transition-colors px-3 py-2 hover:bg-white/10 rounded-[20px]"
              prefetch={true}
            >
              Home
            </Link>
            <Link
              href="/members"
              className="text-white/80 hover:text-white transition-colors px-3 py-2 hover:bg-white/10 rounded-[20px]"
              prefetch={true}
            >
              Members
            </Link>
            <Link
              href="/login"
              className="text-white/80 hover:text-white transition-colors px-3 py-2 hover:bg-white/10 rounded-[20px]"
              prefetch={true}
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
