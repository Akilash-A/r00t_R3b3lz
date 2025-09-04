
'use client';

import React, { useState, useMemo, useTransition } from "react";
import { challenges as initialChallenges, ctfs as initialCtfs } from "@/lib/data";
import type { Challenge, Ctf } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, SlidersHorizontal } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { WriteupForm } from "@/components/admin/writeup-form";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { deleteChallenge } from "@/lib/actions";

const categories: Challenge['category'][] = ['Web', 'Pwn', 'Crypto', 'Misc', 'Rev'];

export default function AdminWriteupsPage() {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [ctfs, setCtfs] = useState(initialCtfs); // Although not mutated, good practice to have it in state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [nameFilter, setNameFilter] = useState('');
  const [ctfFilter, setCtfFilter] = useState<Record<string, boolean>>(
    ctfs.reduce((acc, ctf) => ({ ...acc, [ctf.id]: true }), {})
  );
  const [categoryFilter, setCategoryFilter] = useState<Record<string, boolean>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );

  const filteredChallenges = useMemo(() => {
    return challenges
      .filter((challenge) => {
        const ctf = ctfs.find((c) => c.id === challenge.ctfId);
        return (
          challenge.title.toLowerCase().includes(nameFilter.toLowerCase()) &&
          (ctfFilter[challenge.ctfId] ?? true) &&
          (categoryFilter[challenge.category] ?? true)
        );
      });
  }, [challenges, nameFilter, ctfFilter, categoryFilter, ctfs]);


  const handleFormSubmit = (newOrUpdatedChallenge: Challenge) => {
     if (selectedChallenge) {
      setChallenges(challenges.map(c => c.id === newOrUpdatedChallenge.id ? newOrUpdatedChallenge : c));
    } else {
      setChallenges([newOrUpdatedChallenge, ...challenges]);
    }
    setFormDialogOpen(false);
    setSelectedChallenge(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedChallenge) return;
    
    startTransition(async () => {
      const result = await deleteChallenge(selectedChallenge.id);
      if(result.success) {
        setChallenges(challenges.filter((c) => c.id !== selectedChallenge.id));
        toast({
          title: "Write-up Deleted",
          description: `"${selectedChallenge.title}" has been removed.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
      setDeleteDialogOpen(false);
      setSelectedChallenge(null);
    });
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Manage Write-ups</h1>
          <p className="text-muted-foreground">Add, edit, or remove CTF challenge write-ups.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Filter by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-48"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>CTF Events</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ctfs.map((ctf) => (
                <DropdownMenuCheckboxItem
                  key={ctf.id}
                  checked={ctfFilter[ctf.id] ?? true}
                  onCheckedChange={(checked) => setCtfFilter(prev => ({...prev, [ctf.id]: !!checked}))}
                >
                  {ctf.name}
                </DropdownMenuCheckboxItem>
              ))}
               <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
               {categories.map((cat) => (
                <DropdownMenuCheckboxItem
                  key={cat}
                  checked={categoryFilter[cat] ?? true}
                  onCheckedChange={(checked) => setCategoryFilter(prev => ({...prev, [cat]: !!checked}))}
                >
                  {cat}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddNew}>
            <PlusCircle />
            Add Write-up
          </Button>
        </div>
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
              {filteredChallenges.map((challenge) => {
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
      
      <Dialog open={formDialogOpen} onOpenChange={(open) => {
        if (!open) setSelectedChallenge(null);
        setFormDialogOpen(open);
      }}>
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
        isPending={isPending}
        title="Are you sure you want to delete this write-up?"
        description="This action cannot be undone. This will permanently remove the write-up."
      />
    </div>
  );
}
