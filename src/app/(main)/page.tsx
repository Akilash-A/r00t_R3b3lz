
import { ctfs } from '@/lib/data';
import { CtfCard } from '@/components/ctf-card';
import { Sparkles } from 'lucide-react';
import DotGrid from '@/components/dot-grid';

export default function HomePage() {
  return (
    <div>
      <section className="relative h-[60vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden bg-background">
        <div style={{ width: '100%', height: '600px', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
          <DotGrid
            dotSize={4}
            gap={20}
            baseColor="rgba(82, 39, 255, 0.3)"
            activeColor="#5227FF"
            proximity={80}
            shockRadius={150}
            shockStrength={3}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
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
