import { ctfs } from '@/lib/data';
import { CtfCard } from '@/components/ctf-card';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <section className="py-20 md:py-32 bg-card border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
        <div className="container mx-auto text-center px-4 relative">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-code">
            r00t<span className="text-primary glow">_</span>R3b3lz
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            A collection of our Capture The Flag adventures and solutions. Dive into the world of hacking with us.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <Sparkles className="text-primary" />
            CTF Write-ups
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ctfs.map((ctf, i) => (
              <CtfCard key={ctf.id} ctf={ctf} animationDelay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
