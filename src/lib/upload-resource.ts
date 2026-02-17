'use server'

import { supabaseAdmin } from './supabase-admin';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';

export async function uploadResource(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Not authenticated");
    }

    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const resource_type = formData.get('resource_type') as string;
    const subject = formData.get('subject') as string;
    const semester = formData.get('semester') as string;
    const branch = formData.get('branch') as string;
    const year_batch = formData.get('year_batch') as string;
    const privacy = formData.get('privacy') as string; // "public" | "private"
    const description = formData.get('description') as string;

    if (!file) {
        throw new Error("No file uploaded");
    }

    // 1. Check if user has a profile (required for Foreign Key)
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

    if (profileError || !profile) {
        console.error("Profile not found for upload:", profileError);
        throw new Error("Please complete your profile first before uploading.");
    }

    // 2. Upload File to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${randomUUID()}.${fileExt}`;

    const { data: storageData, error: storageError } = await supabaseAdmin
        .storage
        .from('academic-resources')
        .upload(fileName, file, {
            contentType: file.type,
            upsert: false
        });

    if (storageError) {
        console.error("Storage Error:", storageError);
        throw new Error(`Upload storage failed: ${storageError.message}`);
    }

    // 3. Get Public URL
    const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from('academic-resources')
        .getPublicUrl(fileName);


    // 3. Insert into Database
    // Use supabaseAdmin to bypass RLS for now since we are on server
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
            resource_type: resource_type as any, // Enum cast
            privacy: privacy as any, // Enum cast
            uploader_id: userId,
            created_at: new Date().toISOString(),
        });

    if (dbError) {
        console.error("Database Error Detail:", {
            message: dbError.message,
            code: dbError.code,
            details: dbError.details,
            hint: dbError.hint
        });
        throw new Error(`Failed to save resource metadata: ${dbError.message}`);
    }

    // 4. Award 10 Points to User Profile
    const { error: pointsError } = await supabaseAdmin.rpc('increment_points', {
        user_id: userId,
        amount: 10
    });

    if (pointsError) {
        console.error("Failed to award points:", pointsError);
        // We don't throw here as the upload was already successful, just log it.
    }

    return { success: true };
}
