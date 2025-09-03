'use client';

import React, { useState } from "react";
import { challenges as initialChallenges, ctfs } from "@/lib/data";
import type { Challenge } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { WriteupForm } from "@/components/admin/writeup-form";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminWriteupsPage() {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = () => {
    // In a real app, re-fetch data from the server here.
    setFormDialogOpen(false);
    setSelectedChallenge(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedChallenge) return;
    // Client-side simulation of deletion. In a real app, call a server action.
    setChallenges(challenges.filter((c) => c.id !== selectedChallenge.id));
    toast({
      title: "Write-up Deleted",
      description: `"${selectedChallenge.title}" has been removed.`,
    });
    setDeleteDialogOpen(false);
    setSelectedChallenge(null);
  };

  const handleAddNew = () => {
    setSelectedChallenge(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setFormDialogOpen(true);
  };

  const handleDelete = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Write-ups</h1>
          <p className="text-muted-foreground">Add, edit, or remove CTF challenge write-ups.</p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle />
          Add Write-up
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge Title</TableHead>
                <TableHead>CTF</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((challenge) => {
                const ctf = ctfs.find(c => c.id === challenge.ctfId);
                return (
                  <TableRow key={challenge.id}>
                    <TableCell className="font-medium">{challenge.title}</TableCell>
                    <TableCell>{ctf?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{challenge.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(challenge)}>
                        <Edit />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(challenge)}>
                        <Trash2 />
                         <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <WriteupForm 
          challenge={selectedChallenge} 
          ctfs={ctfs} 
          onFormSubmit={handleFormSubmit} 
        />
      </Dialog>
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Are you sure you want to delete this write-up?"
        description="This action cannot be undone. This will permanently remove the write-up."
      />
    </div>
  );
}
