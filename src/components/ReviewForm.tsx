"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitReview } from "@/lib/reviews";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { checkProfile } from "@/lib/user";
import { useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface ReviewFormProps {
    resourceId: string;
}

export function ReviewForm({ resourceId }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const verifyProfile = async () => {
            const profile = await checkProfile();
            setHasProfile(!!profile);
        };
        verifyProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a star rating");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitReview({ resourceId, rating, comment });
            if (result.success) {
                toast.success("Review submitted!");
                setRating(0);
                setComment("");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to submit review");
            }
        } catch (error: any) {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (hasProfile === false) {
        return (
            <Card className="p-6 border-dashed border-2 bg-muted/30">
                <div className="text-center space-y-3">
                    <p className="text-sm font-medium">Please complete your profile to leave a review.</p>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/complete-profile">Complete Profile</Link>
                    </Button>
                </div>
            </Card>
        );
    }

    if (hasProfile === null) {
        return <div className="p-6 border rounded-xl animate-pulse bg-muted h-32" />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-xl bg-card">
            <h3 className="text-lg font-semibold">Write a Review</h3>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Rating</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            <Star
                                className={cn(
                                    "w-8 h-8",
                                    (hover || rating) >= star
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground/30"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Comment</label>
                <Textarea
                    placeholder="Shared your thoughts on this resource..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    );
}
