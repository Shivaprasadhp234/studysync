import { getResources } from "@/lib/resources";
import { ResourceCard } from "@/components/ResourceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { FileQuestion, Loader2 } from "lucide-react";
import { ResourceFilters } from "@/components/ResourceFilters";

export const dynamic = 'force-dynamic';

function ResourceGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 p-4 border rounded-xl">
                    <Skeleton className="h-[140px] w-full rounded-lg" />
                    <div className="space-y-2 mt-4">
                        <Skeleton className="h-5 w-4/5" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-2 mt-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ResourcesList({ searchParams }: { searchParams: any }) {
    // In Next.js 15, searchParams is already a plain object when passed from a component that awaited it, 
    // or we await it here if passed as a promise.
    const params = await searchParams;
    const { search, semester, branch, resource_type, sortBy } = params;

    const resources = await getResources({
        search: search as string,
        semester: semester as string,
        branch: branch as string,
        resource_type: resource_type as string,
        sortBy: sortBy as string,
    });

    // ... rest same
    if (resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                <FileQuestion className="h-16 w-16 mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground max-w-sm">
                    {search || semester || branch || resource_type
                        ? "Try adjusting your filters or search term to find what you're looking for."
                        : "No resources have been uploaded yet. Be the first to share!"}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
            ))}
        </div>
    );
}

export default async function ResourcesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    // We add a key to Suspense based on searchParams to trigger the fallback skeleton on filter changes
    const suspenseKey = JSON.stringify(resolvedSearchParams);

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Resources Gallery</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Find and share academic materials with your peers.
                    </p>
                </div>
            </div>

            <ResourceFilters />

            <div className="relative min-h-[400px]">
                <Suspense key={suspenseKey} fallback={
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-muted-foreground mb-4 animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Finding resources...</span>
                        </div>
                        <ResourceGridSkeleton />
                    </div>
                }>
                    <ResourcesList searchParams={resolvedSearchParams} />
                </Suspense>
            </div>
        </div>
    );
}

