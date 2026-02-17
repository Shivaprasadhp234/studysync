'use server'

import { supabaseAdmin } from './supabase-admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function submitReview({
    resourceId,
    rating,
    comment
}: {
    resourceId: string,
    rating: number,
    comment: string
}) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Not authenticated. Please sign in." };
        }

        const { error } = await supabaseAdmin
            .from('reviews')
            .upsert({
                resource_id: resourceId,
                user_id: userId,
                rating,
                comment,
                created_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,resource_id'
            });

        if (error) {
            console.error("Review Submission Error:", error);
            return { success: false, error: `Failed to submit review: ${error.message}` };
        }

        // --- Award Points ---
        // 1. Award Reviewer 2 points
        await supabaseAdmin.rpc('increment_points', {
            user_id: userId,
            amount: 2
        });

        // 2. If high rating, award uploader 5 points
        if (rating >= 4) {
            const { data: resource } = await supabaseAdmin
                .from('resources')
                .select('uploader_id')
                .eq('id', resourceId)
                .single();

            if (resource?.uploader_id) {
                await supabaseAdmin.rpc('increment_points', {
                    user_id: resource.uploader_id,
                    amount: 5
                });
            }
        }

        revalidatePath(`/resources/${resourceId}`);
        revalidatePath('/leaderboard');
        return { success: true };
    } catch (err: any) {
        console.error("Critical Review Error:", err);
        return { success: false, error: "An unexpected error occurred. Please try again." };
    }
}

export async function getReviews(resourceId: string) {
    const { data, error } = await supabaseAdmin
        .from('reviews')
        .select(`
            *,
            reviewer:profiles!user_id(full_name)
        `)
        .eq('resource_id', resourceId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }

    return data;
}

export async function getAverageRating(resourceId: string) {
    const { data, error } = await supabaseAdmin
        .from('reviews')
        .select('rating')
        .eq('resource_id', resourceId);

    if (error || !data || data.length === 0) {
        return 0;
    }

    const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
    return Math.round((sum / data.length) * 10) / 10;
}
