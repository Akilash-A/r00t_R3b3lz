'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberSchema, type MemberFormData } from "@/lib/definitions";
import type { TeamMember } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface MemberFormProps {
  member?: TeamMember | null;
  onFormSubmit: () => void;
}

export function MemberForm({ member, onFormSubmit }: MemberFormProps) {
  const { toast } = useToast();
  const isEditMode = !!member;

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: member?.name || "",
      handle: member?.handle || "",
      role: member?.role || "",
    },
  });

  async function onSubmit(data: MemberFormData) {
    // In a real app, you would call a server action here.
    // e.g., await updateMember(data) or await addMember(data)
    console.log({ ...data, id: member?.id });

    toast({
      title: isEditMode ? "Member Updated" : "Member Added",
      description: `${data.name} has been successfully ${isEditMode ? 'updated' : 'added'}. (Simulation)`,
    });
    onFormSubmit(); // This will close the dialog
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{isEditMode ? "Edit Member" : "Add New Member"}</DialogTitle>
        <DialogDescription>
          {isEditMode ? "Update the details for this team member." : "Fill in the details for the new team member."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="T3chC0brA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Handle</FormLabel>
                <FormControl>
                  <Input placeholder="@T3chC0brA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Team Lead & Pwn Expert" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <Input id="avatar" type="file" />
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
                : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
