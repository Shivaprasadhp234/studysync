'use server'

import { supabaseAdmin } from './supabase-admin';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function upsertProfile(formData: FormData) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("Not authenticated");
    }

    const rawFormData = {
        full_name: formData.get('full_name') as string,
        college_name: formData.get('college_name') as string,
        branch: formData.get('branch') as string,
        semester: formData.get('semester') as string,
    }

    // Basic validation could go here

    // Basic validation could go here

    const { error } = await supabaseAdmin
        .from('profiles')
        .upsert({
            id: userId,
            full_name: rawFormData.full_name,
            college_name: rawFormData.college_name,
            branch: rawFormData.branch,
            semester: rawFormData.semester,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        console.error("Supabase upsert error:", error);
        throw new Error("Failed to update profile");
    }

    redirect('/');
}

export async function checkProfile() {
    const { userId } = await auth();
    if (!userId) return null;

    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    return data;
}

export async function getLeaderboard(limit: number = 20) {
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('points', { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }

    return data;
}

export async function getUserRank(userId: string) {
    // This is a bit complex in Supabase without a specific view, but we can do it with a raw query or by fetching all and finding index.
    // For simplicity with Supabase client (since we only have 20 for the leaderboard anyway):
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, points')
        .order('points', { ascending: false });

    if (error || !data) return null;

    const rank = data.findIndex(p => p.id === userId) + 1;
    const userProfile = data.find(p => p.id === userId);

    return {
        rank,
        points: userProfile?.points || 0
    };
}

