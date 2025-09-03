
import { ctfs } from '@/lib/data';
import { CtfCard } from '@/components/ctf-card';
import { Sparkles } from 'lucide-react';
import DotGrid from '@/components/dot-grid';

export default function HomePage() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#160e26' }}>
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
          baseColor="rgba(82, 39, 255, 0.05)"
          activeColor="#5227FF"
          proximity={100}
          speedTrigger={50}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* New Background Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8 text-sm text-white/80">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            New CTF Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white">
            Organized chaos with every<br />
            <span className="text-primary glow">cursor movement!</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 mb-8">
            A collection of our Capture The Flag adventures and solutions. Dive into the world of hacking with us.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors">
              Get Started
            </button>
            <button className="bg-white/10 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors border border-white/20">
              Learn More
            </button>
          </div>
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
