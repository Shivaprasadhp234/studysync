'use client'

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Trash2, ExternalLink, MoreVertical, ShieldAlert } from "lucide-react";
import { deleteResource } from "@/lib/delete-resource";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';

interface Resource {
    id: string;
    title: string;
    created_at: string;
    privacy: string;
    file_url: string;
    avg_rating?: number;
}

export function UserResourcesTable({ resources }: { resources: Resource[] }) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string, url: string) => {
        setIsDeleting(id);
        try {
            await deleteResource(id, url);
            toast.success("Resource deleted successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete resource");
        } finally {
            setIsDeleting(null);
        }
    };

    if (resources.length === 0) {
        return (
            <div className="text-center py-10 bg-muted/20 rounded-xl border-2 border-dashed">
                <p className="text-muted-foreground">You haven't uploaded any resources yet.</p>
                <Button asChild variant="outline" className="mt-4">
                    <Link href="/upload">Upload your first resource</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="border rounded-xl overflow-hidden bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-bold">Title</TableHead>
                        <TableHead className="font-bold">Date</TableHead>
                        <TableHead className="font-bold">Privacy</TableHead>
                        <TableHead className="font-bold text-center">Rating</TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources.map((resource) => (
                        <TableRow key={resource.id} className="group transition-colors">
                            <TableCell className="font-medium">
                                <Link href={`/resources/${resource.id}`} className="hover:underline flex items-center gap-2">
                                    {resource.title}
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {format(new Date(resource.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                                <Badge variant={resource.privacy === 'public' ? 'outline' : 'secondary'} className="capitalize">
                                    {resource.privacy}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                {resource.avg_rating ? (
                                    <span className="font-bold text-amber-500">{resource.avg_rating}</span>
                                ) : (
                                    <span className="text-muted-foreground text-xs italic">N/A</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            disabled={isDeleting === resource.id}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="flex items-center gap-2">
                                                <ShieldAlert className="w-5 h-5 text-destructive" />
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete "{resource.title}" from our servers.
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(resource.id, resource.file_url)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete Permanentally
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
