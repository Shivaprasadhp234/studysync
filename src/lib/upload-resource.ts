'use server'

import { supabaseAdmin } from './supabase-admin';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';

export async function uploadResource(formData: FormData) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Not authenticated. Please sign in." };
        }

        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const resource_type = formData.get('resource_type') as string;
        const subject = formData.get('subject') as string;
        const semester = formData.get('semester') as string;
        const branch = formData.get('branch') as string;
        const year_batch = formData.get('year_batch') as string;
        const privacy = formData.get('privacy') as string;
        const description = formData.get('description') as string;

        if (!file) {
            return { success: false, error: "No file uploaded" };
        }

        // 1. Check if user has a profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            return { success: false, error: "Profile not found. Please complete your profile first." };
        }

        // 2. Upload File
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${randomUUID()}.${fileExt}`;

        const { error: storageError } = await supabaseAdmin
            .storage
            .from('academic-resources')
            .upload(fileName, file, {
                contentType: file.type,
                upsert: false
            });

        if (storageError) {
            return { success: false, error: `Upload storage failed: ${storageError.message}` };
        }

        // 3. Get Public URL
        const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('academic-resources')
            .getPublicUrl(fileName);

        // 4. Insert into Database
        const { error: dbError } = await supabaseAdmin
            .from('resources')
            .insert({
                title,
                description,
                file_url: publicUrl,
                subject,
                semester,
                branch,
                year_batch,
                resource_type: resource_type as any,
                privacy: privacy as any,
                uploader_id: userId,
                created_at: new Date().toISOString(),
            });

        if (dbError) {
            return { success: false, error: `Failed to save resource metadata: ${dbError.message}` };
        }

        // 5. Award Points
        await supabaseAdmin.rpc('increment_points', {
            user_id: userId,
            amount: 10
        });

        return { success: true };
    } catch (err: any) {
        console.error("Critical Upload Error:", err);
        return { success: false, error: "An unexpected error occurred during upload. Please try again." };
    }
}
