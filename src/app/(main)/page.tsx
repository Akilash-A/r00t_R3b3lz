
import { ctfs } from '@/lib/data';
import { CtfCard } from '@/components/ctf-card';
import { Sparkles } from 'lucide-react';
import DotGrid from '@/components/dot-grid';

export default function HomePage() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#0a0614' }}>
      {/* Full screen DotGrid background */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100vh', 
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <DotGrid
          dotSize={6}
          gap={15}
          baseColor="rgba(64, 63, 68, 0.40)"
          activeColor="#1919ff"
          proximity={100}
          speedTrigger={50}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      
      <section className="relative h-[100vh] flex items-center justify-center text-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-code text-white">
            r00t<span className="text-primary glow">_</span>R3b3lz
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70">
            A collection of our Capture The Flag adventures and solutions. Dive into the world of hacking with us.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2 text-white">
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
