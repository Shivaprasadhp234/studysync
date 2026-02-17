import { getResources, Resource } from "@/lib/resources";
import { getReviews, getAverageRating } from "@/lib/reviews";
import { auth } from "@clerk/nextjs/server";
import { Star, Download, Calendar, User, BookOpen, GraduationCap, Building2, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReviewForm } from "@/components/ReviewForm";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function getResource(id: string) {
    // We can use a direct query or update lib/resources.ts
    // For specific detail, better to have a dedicated helper or use supabaseAdmin directly
    const { data, error } = await supabaseAdmin
        .from('resources')
        .select(`
            *,
            uploader:profiles!uploader_id(full_name, college_name)
        `)
        .eq('id', id)
        .single();
    
    if (error || !data) return null;
    return data as Resource;
}

export default async function ResourceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const resource = await getResource(id);
    
    if (!resource) {
        notFound();
    }

    const [reviews, avgRating] = await Promise.all([
        getReviews(id),
        getAverageRating(id)
    ]);

    const { userId } = await auth();

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            {/* Header / Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/resources" className="hover:underline">Resources</Link>
                            <span>/</span>
                            <span className="text-foreground">{resource.resource_type}</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">{resource.title}</h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {resource.avg_rating && (
                            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-bold">
                                <Star className="w-4 h-4 fill-current" />
                                {avgRating} ({reviews.length} reviews)
                            </div>
                        )}
                        <Badge variant="secondary" className="px-3 py-1">{resource.resource_type}</Badge>
                        <Badge variant="outline" className="px-3 py-1">{resource.subject}</Badge>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {resource.description || "No description provided for this resource."}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 border rounded-2xl bg-muted/30">
                        <div className="space-y-1">
                            <div className="flex items-center text-xs text-muted-foreground">
                                <GraduationCap className="w-3 h-3 mr-1" /> Semester
                            </div>
                            <div className="font-semibold">{resource.semester}th Semester</div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center text-xs text-muted-foreground">
                                <BookOpen className="w-3 h-3 mr-1" /> Branch
                            </div>
                            <div className="font-semibold">{resource.branch}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center text-xs text-muted-foreground">
                                <User className="w-3 h-3 mr-1" /> Uploader
                            </div>
                            <div className="font-semibold">{resource.uploader?.full_name}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Building2 className="w-3 h-3 mr-1" /> College
                            </div>
                            <div className="font-semibold text-sm">{resource.uploader?.college_name || "N/A"}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="w-3 h-3 mr-1" /> Uploaded
                            </div>
                            <div className="font-semibold text-sm">{format(new Date(resource.created_at), "MMM d, yyyy")}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 border rounded-2xl bg-card shadow-sm space-y-4 sticky top-24">
                        <div className="flex items-center justify-center p-8 bg-muted rounded-xl">
                            <FileText className="w-16 h-16 text-muted-foreground/40" />
                        </div>
                        <Button asChild className="w-full h-12 text-lg font-bold" size="lg">
                            <Link href={resource.file_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-5 h-5 mr-2" />
                                Download Resource
                            </Link>
                        </Button>
                        <p className="text-xs text-center text-muted-foreground italic">
                            Safe and secure download via Supabase Storage.
                        </p>
                    </div>
                </div>
            </div>

            <Separator className="my-12" />

            {/* Reviews Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    <h2 className="text-2xl font-bold">Peer Reviews ({reviews.length})</h2>
                    
                    {reviews.length === 0 ? (
                        <div className="py-10 text-center border-2 border-dashed rounded-2xl text-muted-foreground">
                            No reviews yet. Be the first to rate this resource!
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review, idx) => (
                                <div key={review.id} className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {review.reviewer?.full_name?.[0] || "?"}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{review.reviewer?.full_name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {format(new Date(review.created_at), "MMM d, yyyy")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground pl-13">
                                        {review.comment || <span className="italic">No comment provided.</span>}
                                    </p>
                                    {idx < reviews.length - 1 && <Separator className="mt-6" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {userId ? (
                        <ReviewForm resourceId={id} />
                    ) : (
                        <div className="p-6 border rounded-2xl bg-muted/30 text-center space-y-4">
                            <p className="text-sm font-medium">Want to review this?</p>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/sign-in">Sign in to Rate</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
