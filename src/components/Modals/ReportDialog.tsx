"use client";

import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitReport } from "@/lib/actions/report";

interface ReportDialogProps {
    resourceId?: string;
    reviewId?: string;
    trigger?: React.ReactNode;
}

const REASONS = [
    { value: "Spam", label: "Spam" },
    { value: "Inappropriate Content", label: "Inappropriate Content" },
    { value: "Harassment", label: "Harassment" },
    { value: "Copyright Violation", label: "Copyright Violation" },
    { value: "Wrong Subject", label: "Wrong Subject" },
];

export function ReportDialog({ resourceId, reviewId, trigger }: ReportDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState("Spam");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await submitReport({
                resourceId,
                reviewId,
                reason,
                description,
            });

            if (result.success) {
                toast.success("Report Submitted", {
                    description: "Thank you for helping us keep the community safe.",
                });
                setOpen(false);
                setDescription("");
            } else {
                toast.error("Submission Failed", {
                    description: result.error,
                });
            }
        } catch (error) {
            toast.error("Error", {
                description: "An unexpected error occurred.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors">
                        <Flag className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Flag className="h-5 w-5 text-destructive" />
                        Report Content
                    </DialogTitle>
                    <DialogDescription>
                        Why are you reporting this? Our admins will review it within 24 hours.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <RadioGroup value={reason} onValueChange={setReason} className="gap-3">
                        {REASONS.map((r) => (
                            <div key={r.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={r.value} id={`reason-${r.value}`} />
                                <Label htmlFor={`reason-${r.value}`} className="cursor-pointer">
                                    {r.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Additional Details (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Help our moderators understand the issue..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="resize-none"
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="font-bold"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Report"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
