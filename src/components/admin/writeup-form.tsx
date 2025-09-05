
'use client';

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { challengeSchema, type ChallengeFormData, type Challenge, type Ctf } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { upsertChallenge } from "@/lib/actions";
import { useTransition } from "react";

interface WriteupFormProps {
  challenge?: Challenge | null;
  ctfs: Ctf[];
  onFormSubmit: (challenge: Challenge) => void;
}

const categories: Challenge['category'][] = ['Web', 'Pwn', 'Crypto', 'Misc', 'Rev'];

function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-invert dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground whitespace-pre-wrap p-4 border rounded-md min-h-[300px]">
      <ReactMarkdown>
        {content || "Start typing to see a preview..."}
      </ReactMarkdown>
    </div>
  )
}

export function WriteupForm({ challenge, ctfs, onFormSubmit }: WriteupFormProps) {
  const { toast } = useToast();
  const isEditMode = !!challenge;
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: challenge?.title || "",
      ctfId: challenge?.ctfId || "",
      category: challenge?.category || undefined,
      description: challenge?.description || "",
      writeup: challenge?.writeup || "",
      imageUrl: challenge?.imageUrl || "",
    },
  });

  const writeupContent = useWatch({ control: form.control, name: 'writeup' });

  async function onSubmit(data: ChallengeFormData) {
     startTransition(async () => {
      const result = await upsertChallenge(data, challenge?.id || null);
      if (result.success && result.data) {
        toast({
          title: isEditMode ? "Write-up Updated" : "Write-up Added",
          description: `"${result.data.title}" has been successfully ${isEditMode ? 'updated' : 'added'}.`,
        });
        onFormSubmit(result.data);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    });
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>{isEditMode ? "Edit Write-up" : "Add New Write-up"}</DialogTitle>
        <DialogDescription>
          {isEditMode ? "Update the details for this challenge." : "Fill in the details for the new write-up."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form id="writeup-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto pr-6 flex-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter challenge title (e.g., Login Bypass)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ctfId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CTF</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a CTF event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ctfs.map(ctf => (
                        <SelectItem key={ctf.id} value={ctf.id}>{ctf.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select challenge category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter challenge description (e.g., A simple challenge to get you started with web exploitation...)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter challenge image URL (e.g., https://example.com/challenge.png)" {...field} />
                </FormControl>
                 <p className="text-sm text-muted-foreground">
                    Provide a direct URL to an image for the challenge.
                 </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="challenge-image-upload">Upload Challenge Image</Label>
            <Input id="challenge-image-upload" type="file" disabled />
            <p className="text-sm text-muted-foreground">
              Image upload is for demonstration and won't be saved. Please provide a URL.
            </p>
          </div>
          <FormField
            control={form.control}
            name="writeup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Write-up (Markdown)</FormLabel>
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Markdown</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit">
                    <FormControl>
                      <Textarea placeholder="Enter write-up content in Markdown format (e.g., # Challenge Title...)" {...field} rows={15} />
                    </FormControl>
                  </TabsContent>
                  <TabsContent value="preview">
                     <MarkdownPreview content={writeupContent} />
                  </TabsContent>
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        <DialogFooter className="mt-4 pt-4 border-t">
          <Button type="submit" form="writeup-form" disabled={isPending}>
            {isPending
              ? "Saving..."
              : isEditMode
              ? "Save Changes"
              : "Add Write-up"}
          </Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
}
