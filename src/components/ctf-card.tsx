import type { Ctf } from '@/lib/definitions';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export function CtfCard({ ctf }: { ctf: Ctf }) {
  return (
    <Link href={`/ctfs/${ctf.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={ctf.bannerUrl}
            alt={`${ctf.name} banner`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="cybersecurity abstract"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{ctf.name}</CardTitle>
          <CardDescription>{ctf.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm font-medium text-primary">
            View Write-ups
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
