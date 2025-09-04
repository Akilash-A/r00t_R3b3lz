
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ctfSchema, type CtfFormData } from "@/lib/definitions";
import type { Ctf } from "@/lib/definitions";
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

interface CtfFormProps {
  ctf?: Ctf | null;
  onFormSubmit: () => void;
}

export function CtfForm({ ctf, onFormSubmit }: CtfFormProps) {
  const { toast } = useToast();
  const isEditMode = !!ctf;

  const form = useForm<CtfFormData>({
    resolver: zodResolver(ctfSchema),
    defaultValues: {
      name: ctf?.name || "",
      slug: ctf?.slug || "",
      description: ctf?.description || "",
    },
  });

  async function onSubmit(data: CtfFormData) {
    // In a real app, you would call a server action here.
    console.log({ ...data, id: ctf?.id });

    toast({
      title: isEditMode ? "CTF Event Updated" : "CTF Event Added",
      description: `"${data.name}" has been successfully ${isEditMode ? 'updated' : 'added'}. (Simulation)`,
    });
    onFormSubmit(); // This will close the dialog
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
          <div className="space-y-2">
            <Label htmlFor="banner">Banner Image</Label>
            <Input id="banner" type="file" />
            <p className="text-sm text-muted-foreground">
              Image upload is for demonstration and won't be saved.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
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
