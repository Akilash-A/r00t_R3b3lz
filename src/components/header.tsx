import Link from 'next/link';
import { Terminal } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-6 bg-card/50 backdrop-blur-lg border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" prefetch={false}>
          <Terminal className="h-7 w-7 text-primary transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-xl font-bold font-code text-foreground">
            r00t<span className="text-primary group-hover:glow transition-shadow duration-300">_</span>R3b3lz
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-foreground/80 hover:text-foreground transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            prefetch={false}
          >
            Write-ups
          </Link>
          <Link
            href="/members"
            className="text-foreground/80 hover:text-foreground transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            prefetch={false}
          >
            Members
          </Link>
        </nav>
      </div>
    </header>
  );
}
