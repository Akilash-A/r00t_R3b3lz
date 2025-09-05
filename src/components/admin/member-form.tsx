
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberSchema, type MemberFormData, type TeamMember } from "@/lib/definitions";
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
import { upsertMember } from "@/lib/actions";
import { useTransition, useState, useEffect } from "react";
import { Instagram, Twitter, Github, Linkedin, Mail, Globe } from "lucide-react";

interface MemberFormProps {
  member?: TeamMember | null;
  onFormSubmit: (member: TeamMember) => void;
}

export function MemberForm({ member, onFormSubmit }: MemberFormProps) {
  const { toast } = useToast();
  const isEditMode = !!member;
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: member?.name || "",
      social: {
        instagram: member?.social?.instagram || "",
        twitter: member?.social?.twitter || "",
        github: member?.social?.github || "",
        linkedin: member?.social?.linkedin || "",
        email: member?.social?.email || "",
        website: member?.social?.website || "",
      },
      role: member?.role || "",
      avatarUrl: member?.avatarUrl || "",
    },
  });

  // Reset form when member prop changes (for edit mode)
  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name || "",
        social: {
          instagram: member.social?.instagram || "",
          twitter: member.social?.twitter || "",
          github: member.social?.github || "",
          linkedin: member.social?.linkedin || "",
          email: member.social?.email || "",
          website: member.social?.website || "",
        },
        role: member.role || "",
        avatarUrl: member.avatarUrl || "",
      });
    } else {
      // Reset to empty form for add mode
      form.reset({
        name: "",
        social: {
          instagram: "",
          twitter: "",
          github: "",
          linkedin: "",
          email: "",
          website: "",
        },
        role: "",
        avatarUrl: "",
      });
    }
  }, [member, form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      form.setValue('avatarUrl', result.url);
      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(data: MemberFormData) {
    startTransition(async () => {
      const result = await upsertMember(data, member?.id || null);
      if (result.success && result.data) {
        toast({
          title: isEditMode ? "Member Updated" : "Member Added",
          description: `${result.data.name} has been successfully ${isEditMode ? 'updated' : 'added'}.`,
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
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
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
                  <Input placeholder="Enter full name (e.g., John Doe)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Social Media Fields */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Social Media Links (Optional)</Label>
            
            <FormField
              control={form.control}
              name="social.instagram"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Instagram className="h-4 w-4 text-pink-500" />
                      <Input placeholder="Instagram URL" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="social.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Twitter className="h-4 w-4 text-blue-400" />
                      <Input placeholder="X/Twitter URL" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="social.github"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Github className="h-4 w-4 text-gray-400" />
                      <Input placeholder="GitHub URL" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="social.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <Input placeholder="LinkedIn URL" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="social.email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-red-500" />
                      <Input placeholder="Email address" type="email" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="social.website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-green-500" />
                      <Input placeholder="Personal website URL" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Enter role (e.g., Team Lead & Pwn Expert)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter avatar image URL or upload below" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="avatar">Upload Avatar</Label>
            <Input 
              id="avatar" 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <p className="text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : "Upload an image file to automatically fill the avatar URL above."}
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
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
