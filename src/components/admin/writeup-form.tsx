
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
import { useTransition, useState, useEffect } from "react";
import { Upload } from "lucide-react";

interface WriteupFormProps {
  challenge?: Challenge | null;
  ctfs: Ctf[];
  onFormSubmit: (challenge: Challenge) => void;
}

const categories: Challenge['category'][] = ['Web', 'Pwn', 'Crypto', 'Misc', 'Rev'];

function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-invert dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground whitespace-pre-wrap p-3 border rounded-md bg-background text-foreground border-border overflow-y-auto max-w-none w-full min-h-[380px]">
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
  const [isUploading, setIsUploading] = useState(false);

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

  // Reset form when challenge prop changes (for edit mode)
  useEffect(() => {
    if (challenge) {
      form.reset({
        title: challenge.title || "",
        ctfId: challenge.ctfId || "",
        category: challenge.category || undefined,
        description: challenge.description || "",
        writeup: challenge.writeup || "",
        imageUrl: challenge.imageUrl || "",
      });
    } else {
      // Reset to empty form for add mode
      form.reset({
        title: "",
        ctfId: "",
        category: undefined,
        description: "",
        writeup: "",
        imageUrl: "",
      });
    }
  }, [challenge, form]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Update the image URL field with the uploaded image URL
        form.setValue('imageUrl', `${window.location.origin}${result.url}`);
        toast({
          title: "Image Uploaded",
          description: "Challenge image has been uploaded successfully.",
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
    <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-background text-foreground">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-foreground">{isEditMode ? "Edit Write-up" : "Add New Write-up"}</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          {isEditMode ? "Update the details for this challenge." : "Fill in the details for the new write-up."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form id="writeup-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-y-auto pr-2 flex-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Challenge Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter challenge title (e.g., Login Bypass)" 
                    {...field} 
                    className="bg-background text-foreground border-border"
                  />
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
                  <FormLabel className="text-foreground">CTF</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background text-foreground border-border">
                        <SelectValue placeholder="Select a CTF event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border-border">
                      {ctfs.map(ctf => (
                        <SelectItem key={ctf.id} value={ctf.id} className="text-foreground hover:bg-accent">{ctf.name}</SelectItem>
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
                  <FormLabel className="text-foreground">Category</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background text-foreground border-border">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border-border">
                      {categories.map(category => (
                        <SelectItem key={category} value={category} className="text-foreground hover:bg-accent">{category}</SelectItem>
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
                <FormLabel className="text-foreground">Short Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter challenge description (e.g., A simple challenge to get you started with web exploitation...)" 
                    {...field} 
                    className="bg-background text-foreground border-border min-h-[80px]"
                  />
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
                <FormLabel className="text-foreground">Challenge Image URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter challenge image URL (e.g., https://example.com/challenge.png)" 
                    {...field} 
                    className="bg-background text-foreground border-border"
                  />
                </FormControl>
                 <p className="text-sm text-muted-foreground">
                    Provide a direct URL to an image for the challenge.
                 </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="challenge-image-upload" className="text-foreground">Upload Challenge Image</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="challenge-image-upload" 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer bg-background text-foreground border-border"
              />
              {isUploading && <Upload className="h-4 w-4 animate-spin text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a challenge image. Supported formats: PNG, JPG, GIF (max 5MB)
            </p>
          </div>
          <FormField
            control={form.control}
            name="writeup"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Write-up (Markdown)</FormLabel>
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-muted">
                    <TabsTrigger value="edit" className="text-foreground">Markdown</TabsTrigger>
                    <TabsTrigger value="preview" className="text-foreground">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit" className="w-full">
                    <FormControl>
                      <Textarea 
                        placeholder="Enter write-up content in Markdown format (e.g., # Challenge Title...)" 
                        {...field} 
                        rows={15} 
                        className="bg-background text-foreground border-border font-mono w-full"
                      />
                    </FormControl>
                  </TabsContent>
                  <TabsContent value="preview" className="w-full">
                     <MarkdownPreview content={writeupContent} />
                  </TabsContent>
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        <DialogFooter className="mt-6 pt-4 border-t border-border">
          <Button 
            type="submit" 
            form="writeup-form" 
            disabled={isPending || isUploading}
            className="bg-primary text-black hover:bg-primary/90"
          >
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
