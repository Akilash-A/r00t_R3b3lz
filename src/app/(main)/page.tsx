import { ctfs } from '@/lib/data';
import { CtfCard } from '@/components/ctf-card';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

const AnimatedHeroBackground = () => (
  <>
    <div className="absolute inset-0 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div className="absolute inset-0 h-full w-full bg-background [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
    <svg
      viewBox="0 0 1024 1024"
      className="absolute top-1/2 left-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
      aria-hidden="true"
    >
      <circle
        cx={512}
        cy={512}
        r={512}
        fill="url(#gradient)"
        fillOpacity="0.7"
      />
      <defs>
        <radialGradient id="gradient">
          <stop stopColor="hsl(var(--primary))" />
          <stop offset={1} stopColor="hsl(var(--primary) / 0.5)" />
        </radialGradient>
      </defs>
    </svg>
  </>
);


export default function HomePage() {
  return (
    <div>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white overflow-hidden bg-background">
        <AnimatedHeroBackground />
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
