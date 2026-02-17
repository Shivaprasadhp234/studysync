import { supabaseAdmin } from './supabase-admin';
import { auth } from '@clerk/nextjs/server';
import { checkProfile } from './user';

export type Resource = {
    id: string;
    title: string;
    resource_type: string;
    subject: string;
    semester: string;
    branch: string;
    file_url: string;
    privacy: "public" | "private";
    created_at: string;
    description?: string;
    uploader: {
        full_name: string;
        college_name?: string;
    } | null;
};

export interface GetResourcesParams {
    search?: string;
    semester?: string;
    branch?: string;
    resource_type?: string;
    sortBy?: string; // "newest" | "oldest"
}

// Helper to apply filters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(query: any, filters: GetResourcesParams) {
    if (filters.search) {
        // Supabase ILIKE fuzzy search across multiple columns
        const searchStr = `%${filters.search}%`;
        query = query.or(`title.ilike.${searchStr},subject.ilike.${searchStr},description.ilike.${searchStr}`);
    }
    if (filters.semester && filters.semester !== "all") {
        query = query.eq('semester', filters.semester);
    }
    if (filters.branch && filters.branch !== "all") {
        query = query.eq('branch', filters.branch);
    }
    if (filters.resource_type && filters.resource_type !== "all") {
        query = query.eq('resource_type', filters.resource_type);
    }

    // Initial sort in query (though we re-sort after merging)
    const isAsc = filters.sortBy === "oldest";
    query = query.order('created_at', { ascending: isAsc });

    return query;
}

export async function getResources(filters: GetResourcesParams = {}) {
    const { userId } = await auth();
    let userCollege = "";

    if (userId) {
        const profile = await checkProfile();
        if (profile) {
            userCollege = profile.college_name;
        }
    }

    // 1. Fetch Public Resources
    let publicQuery = supabaseAdmin
        .from('resources')
        .select(`
            *,
            uploader:profiles!uploader_id(full_name, college_name),
            reviews!resource_id(rating)
        `)
        .eq('privacy', 'public')
        .limit(100);

    publicQuery = applyFilters(publicQuery, filters);

    const { data: publicResources, error: publicError } = await publicQuery;

    if (publicError) {
        console.error("Error fetching public resources:", {
            message: publicError.message,
            code: publicError.code,
            details: publicError.details,
            hint: publicError.hint
        });
        return [];
    }

    let privateResources: any[] = [];

    // 2. Fetch Private Resources (if user has a college)
    if (userCollege) {
        let privateQuery = supabaseAdmin
            .from('resources')
            .select(`
                *,
                uploader:profiles!uploader_id!inner(full_name, college_name),
                reviews!resource_id(rating)
            `)
            .eq('privacy', 'private')
            .eq('uploader.college_name', userCollege)
            .limit(100);

        privateQuery = applyFilters(privateQuery, filters);

        const { data, error } = await privateQuery;

        if (!error && data) {
            privateResources = data;
        } else if (error) {
            console.error("Error fetching private resources:", error);
        }
    }

    // Merge
    const allResources = [...(publicResources || []), ...privateResources];

    // Remove duplicates and Calculate Ratings
    const uniqueIds = new Set();
    const processedResources = allResources.filter(r => {
        if (uniqueIds.has(r.id)) return false;
        uniqueIds.add(r.id);
        return true;
    }).map(r => {
        const ratings = (r as any).reviews || [];
        const avg_rating = ratings.length > 0
            ? Math.round((ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0) / ratings.length) * 10) / 10
            : 0;
        return { ...r, avg_rating };
    });

    // Final sort
    const isAsc = filters.sortBy === "oldest";
    processedResources.sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return isAsc ? timeA - timeB : timeB - timeA;
    });

    return processedResources as (Resource & { avg_rating: number })[];
}
