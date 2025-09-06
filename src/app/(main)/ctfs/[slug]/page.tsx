import { getCtfsFromDB, getChallengesFromDB } from '@/lib/data';
import type { Challenge } from '@/lib/definitions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import PixelBlastBackground from '@/components/PixelBlastBackground';

export default async function CtfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ctfs = await getCtfsFromDB();
  const challenges = await getChallengesFromDB();
  
  const ctf = ctfs.find((c) => c.slug === slug);
  if (!ctf) {
    notFound();
  }

  const ctfChallenges = challenges.filter((c) => c.ctfId === ctf.id);
  const challengesByCategory = ctfChallenges.reduce((acc, challenge) => {
    (acc[challenge.category] = acc[challenge.category] || []).push(challenge);
    return acc;
  }, {} as Record<string, Challenge[]>);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#060010' }}>
      {/* PixelBlast Background */}
      <PixelBlastBackground />
      
      {/* Content with relative positioning to appear above background */}
      <div className="relative z-10">
        <section className="relative h-64 md:h-80 w-full">
          <Image
            src={ctf.bannerUrl}
            alt={`${ctf.name} banner`}
            fill
            className="object-cover"
            data-ai-hint="cybersecurity abstract"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto h-full flex flex-col justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{ctf.name}</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl">{ctf.description}</p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="bg-background/30 backdrop-blur-sm p-8 max-h-[70vh] overflow-y-auto max-w-6xl mx-auto border border-white/10" style={{ borderRadius: '20px' }}>
              <h2 className="text-3xl font-bold mb-8 text-center text-white">Challenges</h2>
              {Object.keys(challengesByCategory).length > 0 ? (
              <Accordion type="single" collapsible className="w-full mx-auto">
                {Object.entries(challengesByCategory).map(([category, challengesList]) => (
                  <AccordionItem value={category} key={category}>
                    <AccordionTrigger className="text-2xl font-semibold">{category}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        {challengesList.map((challenge) => (
                           <Dialog key={challenge.id}>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
                              <div>
                                <h4 className="font-semibold">{challenge.title}</h4>
                                <p className="text-sm text-muted-foreground">{challenge.description}</p>
                              </div>
                              <DialogTrigger asChild>
                                <Button variant="outline"><FileText className="mr-2 h-4 w-4" />View Write-up</Button>
                              </DialogTrigger>
                            </div>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                               <DialogHeader>
                                 <DialogTitle className="text-2xl">{challenge.title}</DialogTitle>
                                 <DialogDescription>
                                  From {ctf.name} - {challenge.category}
                                 </DialogDescription>
                               </DialogHeader>
                               <div className="space-y-6">
                                 {/* Challenge Image - Display first if available */}
                                 {challenge.imageUrl && (
                                   <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-border">
                                     <Image
                                       src={challenge.imageUrl}
                                       alt={`${challenge.title} challenge image`}
                                       fill
                                       className="object-contain bg-muted"
                                       priority
                                     />
                                   </div>
                                 )}
                                 
                                 {/* Markdown Content */}
                                 <div className="prose prose-invert dark:prose-invert prose-headings:text-foreground prose-headings:mb-2 prose-headings:mt-4 prose-p:text-muted-foreground prose-p:my-2 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-ul:my-2 prose-li:text-muted-foreground prose-li:my-0 prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground max-w-none">
                                   <ReactMarkdown>
                                     {challenge.writeup || "No writeup content available."}
                                   </ReactMarkdown>
                                 </div>
                               </div>
                             </DialogContent>
                           </Dialog>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-muted-foreground">Write-ups for this CTF are coming soon!</p>
            )}
            </div>
          </div>
      </section>
      </div>
    </div>
  );
}
