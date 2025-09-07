
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ctfSchema, type CtfFormData, type Ctf } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import { upsertCtf } from "@/lib/actions";
import { useTransition, useState } from "react";
import React from "react";
import { Upload } from "lucide-react";

interface CtfFormProps {
  ctf?: Ctf | null;
  onFormSubmit: (ctf: Ctf) => void;
}

export function CtfForm({ ctf, onFormSubmit }: CtfFormProps) {
  const { toast } = useToast();
  const isEditMode = !!ctf;
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

  const form = useForm<CtfFormData>({
    resolver: zodResolver(ctfSchema),
    defaultValues: {
      name: ctf?.name || "",
      slug: ctf?.slug || "",
      description: ctf?.description || "",
      bannerUrl: ctf?.bannerUrl || ""
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/temp', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Clean up previous temp file if exists
        if (tempImageUrl && tempImageUrl.includes('/uploads/temp/')) {
          const oldTempFilename = tempImageUrl.split('/uploads/temp/')[1];
          fetch(`/api/upload/temp/cleanup?filename=${oldTempFilename}`, {
            method: 'DELETE'
          }).catch(console.error);
        }

        // Update the banner URL field with the temporary upload URL
        const fullTempUrl = `${window.location.origin}${result.url}`;
        form.setValue('bannerUrl', fullTempUrl);
        setTempImageUrl(fullTempUrl);
        
        toast({
          title: "Image Ready",
          description: "Banner image is ready. Click 'Save' to finalize.",
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

  // Clean up temp file when component unmounts or form is cancelled
  React.useEffect(() => {
    return () => {
      if (tempImageUrl && tempImageUrl.includes('/uploads/temp/')) {
        const tempFilename = tempImageUrl.split('/uploads/temp/')[1];
        fetch(`/api/upload/temp/cleanup?filename=${tempFilename}`, {
          method: 'DELETE'
        }).catch(console.error);
      }
    };
  }, [tempImageUrl]);

  async function onSubmit(data: CtfFormData) {
    startTransition(async () => {
      const result = await upsertCtf(data, ctf?.id || null);
      if (result.success && result.data) {
        toast({
          title: isEditMode ? "CTF Event Updated" : "CTF Event Added",
          description: `"${result.data.name}" has been successfully ${isEditMode ? 'updated' : 'added'}.`,
        });
        setTempImageUrl(null); // Clear temp image URL on successful save
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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{isEditMode ? "Edit CTF Event" : "Add New CTF Event"}</DialogTitle>
        <DialogDescription>
          {isEditMode ? "Update the details for this event." : "Fill in the details for the new event."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event name (e.g., FuncTF 2024)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Enter URL slug (e.g., functf-2024)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter event description (e.g., A beginner-friendly CTF with diverse challenges...)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bannerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter banner image URL or upload below" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="banner">Upload Banner Image</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="banner" 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : "Upload an image file (max 5MB) or provide a URL above. Image will be saved when you click 'Save Changes'."}
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Add Event"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
