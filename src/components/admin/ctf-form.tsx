
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
import { useTransition } from "react";

interface CtfFormProps {
  ctf?: Ctf | null;
  onFormSubmit: (ctf: Ctf) => void;
}

export function CtfForm({ ctf, onFormSubmit }: CtfFormProps) {
  const { toast } = useToast();
  const isEditMode = !!ctf;
  const [isPending, startTransition] = useTransition();

  const form = useForm<CtfFormData>({
    resolver: zodResolver(ctfSchema),
    defaultValues: {
      name: ctf?.name || "",
      slug: ctf?.slug || "",
      description: ctf?.description || "",
      bannerUrl: ctf?.bannerUrl || "https://picsum.photos/1200/400"
    },
  });

  async function onSubmit(data: CtfFormData) {
    startTransition(async () => {
      const result = await upsertCtf(data, ctf?.id || null);
      if (result.success && result.data) {
        toast({
          title: isEditMode ? "CTF Event Updated" : "CTF Event Added",
          description: `"${result.data.name}" has been successfully ${isEditMode ? 'updated' : 'added'}.`,
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
                  <Input placeholder="FuncTF 2024" {...field} />
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
                  <Input placeholder="functf-2024" {...field} />
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
                  <Textarea placeholder="A beginner-friendly CTF..." {...field} />
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
                  <Input placeholder="https://picsum.photos/1200/400" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="banner">Upload Banner Image</Label>
            <Input id="banner" type="file" disabled/>
            <p className="text-sm text-muted-foreground">
              Image upload is for demonstration and won't be saved. Please provide a URL.
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
