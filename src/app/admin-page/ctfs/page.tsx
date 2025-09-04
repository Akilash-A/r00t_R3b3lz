
'use client';

import React, { useState, useTransition } from "react";
import { ctfs as initialCtfs } from "@/lib/data";
import type { Ctf } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CtfForm } from "@/components/admin/ctf-form";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { deleteCtf } from "@/lib/actions";

export default function AdminCtfsPage() {
  const [ctfs, setCtfs] = useState(initialCtfs);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCtf, setSelectedCtf] = useState<Ctf | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFormSubmit = (newOrUpdatedCtf: Ctf) => {
    if (selectedCtf) {
      setCtfs(ctfs.map(c => c.id === newOrUpdatedCtf.id ? newOrUpdatedCtf : c));
    } else {
      setCtfs([newOrUpdatedCtf, ...ctfs]);
    }
    setFormDialogOpen(false);
    setSelectedCtf(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedCtf) return;

    startTransition(async () => {
      const result = await deleteCtf(selectedCtf.id);
      if (result.success) {
        setCtfs(ctfs.filter((c) => c.id !== selectedCtf.id));
        toast({
          title: "CTF Event Deleted",
          description: `"${selectedCtf.name}" has been removed.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
      setDeleteDialogOpen(false);
      setSelectedCtf(null);
    });
  };

  const handleAddNew = () => {
    setSelectedCtf(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (ctf: Ctf) => {
    setSelectedCtf(ctf);
    setFormDialogOpen(true);
  };

  const handleDelete = (ctf: Ctf) => {
    setSelectedCtf(ctf);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage CTF Events</h1>
          <p className="text-muted-foreground">Add, edit, or remove CTF events.</p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle />
          Add Event
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Banner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ctfs.map((ctf) => (
                <TableRow key={ctf.id}>
                  <TableCell className="font-medium">{ctf.name}</TableCell>
                  <TableCell>
                    <Image
                      src={ctf.bannerUrl}
                      alt={ctf.name}
                      width={120}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(ctf)}>
                      <Edit />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(ctf)}>
                      <Trash2 />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={formDialogOpen} onOpenChange={(open) => {
        if (!open) setSelectedCtf(null);
        setFormDialogOpen(open);
      }}>
        <CtfForm ctf={selectedCtf} onFormSubmit={handleFormSubmit} />
      </Dialog>
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isPending={isPending}
        title="Are you sure you want to delete this CTF event?"
        description="This action cannot be undone. This will permanently remove the event and may affect associated write-ups."
      />
    </div>
  );
}
