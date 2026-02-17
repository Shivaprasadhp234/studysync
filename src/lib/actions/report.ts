'use server'

import { supabaseAdmin } from '../supabase-admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function submitReport({
    resourceId,
    reviewId,
    reason,
    description
}: {
    resourceId?: string,
    reviewId?: string,
    reason: string,
    description?: string
}) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Not authenticated. Please sign in." };
        }

        const { error } = await supabaseAdmin
            .from('reports')
            .insert({
                reporter_id: userId,
                resource_id: resourceId || null,
                review_id: reviewId || null,
                reason,
                description,
                status: 'pending',
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error("Report Submission Error:", error);
            return { success: false, error: `Failed to submit report: ${error.message}` };
        }

        if (resourceId) {
            revalidatePath(`/resources/${resourceId}`);
        }

        return { success: true };
    } catch (err: any) {
        console.error("Critical Report Error:", err);
        return { success: false, error: "An unexpected error occurred. Please try again." };
    }
}
