'use client';

import React, { useState, useTransition, useEffect } from "react";
import type { TeamMember } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { MemberForm } from "@/components/admin/member-form";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteMember } from "@/lib/actions";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load members from API on component mount
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch('/api/members');
        const result = await response.json();
        
        if (result.success) {
          setMembers(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch members');
        }
      } catch (error) {
        console.error('Error loading members:', error);
        toast({
          title: "Error",
          description: "Failed to load members from database.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMembers();
  }, [toast]);

  const handleFormSubmit = (newOrUpdatedMember: TeamMember) => {
    if (selectedMember) {
      setMembers(members.map(m => m.id === newOrUpdatedMember.id ? newOrUpdatedMember : m));
    } else {
      setMembers([newOrUpdatedMember, ...members]);
    }
    setFormDialogOpen(false);
    setSelectedMember(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedMember) return;
    
    startTransition(async () => {
      const result = await deleteMember(selectedMember.id);
      if (result.success) {
        setMembers(members.filter((m) => m.id !== selectedMember.id));
        toast({
          title: "Member Deleted",
          description: `${selectedMember.name} has been removed.`,
        });
      } else {
         toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
      setDeleteDialogOpen(false);
      setSelectedMember(null);
    });
  };
  
  const handleAddNew = () => {
    setSelectedMember(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setFormDialogOpen(true);
  };

  const handleDelete = (member: TeamMember) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Members</h1>
          <p className="text-muted-foreground">Add, edit, or remove team members.</p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle />
          Add Member
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Handle</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading team members...
                  </TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No team members found. Add your first member!
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="hacker portrait" />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {member.name}
                      </div>
                    </TableCell>
                    <TableCell>{member.handle}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                        <Edit />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(member)}>
                        <Trash2 />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={formDialogOpen} onOpenChange={(open) => {
        if (!open) setSelectedMember(null);
        setFormDialogOpen(open);
      }}>
        <MemberForm member={selectedMember} onFormSubmit={handleFormSubmit} />
      </Dialog>
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isPending={isPending}
        title="Are you sure you want to delete this member?"
        description="This action cannot be undone. This will permanently remove the member from the team."
      />
    </div>
  );
}
