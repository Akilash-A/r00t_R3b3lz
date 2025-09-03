import { ctfs } from '@/lib/data';
import { CtfCard } from '@/components/ctf-card';

export default function HomePage() {
  return (
    <div>
      <section className="py-20 md:py-32 bg-card border-b">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-code">
            r00t<span className="text-primary">_</span>R3b3lz
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            A collection of our Capture The Flag adventures and solutions. Dive into the world of hacking with us.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">CTF Write-ups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ctfs.map((ctf) => (
              <CtfCard key={ctf.id} ctf={ctf} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
