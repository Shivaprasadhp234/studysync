'use server'

import { supabaseAdmin } from './supabase-admin';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

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
