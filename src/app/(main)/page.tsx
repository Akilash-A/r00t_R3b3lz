
import { ctfs } from '@/lib/data';
import { CtfCard } from '@/components/ctf-card';
import { Sparkles } from 'lucide-react';
import DotGrid from '@/components/dot-grid';

export default function HomePage() {
  return (
    <div>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center overflow-hidden bg-background">
        <DotGrid
            dotSize={2}
            gap={25}
            baseColor="hsl(var(--primary))"
            activeColor="hsl(var(--primary))"
            proximity={100}
            shockRadius={200}
            shockStrength={0.5}
            resistance={500}
            returnDuration={0.5}
            className="absolute inset-0 -z-10"
          />
        <div className="container mx-auto px-4 relative">
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

    