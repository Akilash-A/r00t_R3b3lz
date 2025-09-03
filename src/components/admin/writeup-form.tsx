'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { challengeSchema, type ChallengeFormData } from "@/lib/definitions";
import type { Challenge, Ctf } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WriteupFormProps {
  challenge?: Challenge | null;
  ctfs: Ctf[];
  onFormSubmit: () => void;
}

const categories: Challenge['category'][] = ['Web', 'Pwn', 'Crypto', 'Misc', 'Rev'];

export function WriteupForm({ challenge, ctfs, onFormSubmit }: WriteupFormProps) {
  const { toast } = useToast();
  const isEditMode = !!challenge;

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: challenge?.title || "",
      ctfId: challenge?.ctfId || "",
      category: challenge?.category || undefined,
      description: challenge?.description || "",
      writeup: challenge?.writeup || "",
    },
  });

  async function onSubmit(data: ChallengeFormData) {
    // In a real app, you would call a server action here.
    console.log({ ...data, id: challenge?.id });

    toast({
      title: isEditMode ? "Write-up Updated" : "Write-up Added",
      description: `"${data.title}" has been successfully ${isEditMode ? 'updated' : 'added'}. (Simulation)`,
    });
    onFormSubmit();
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto pr-6 flex-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge Title</FormLabel>
                <FormControl>
                  <Input placeholder="Login Bypass" {...field} />
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
                        <SelectValue placeholder="Select a CTF" />
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
                        <SelectValue placeholder="Select a category" />
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
                  <Textarea placeholder="A simple challenge to get you started..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="writeup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Write-up (Markdown)</FormLabel>
                <FormControl>
                  <Textarea placeholder="# Title..." {...field} rows={15} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        <DialogFooter className="mt-4 pt-4 border-t">
          <Button type="submit" form="writeup-form" disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
            {form.formState.isSubmitting
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
