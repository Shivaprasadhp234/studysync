'use server'

import { supabaseAdmin } from './supabase-admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function deleteResource(id: string, fileUrl: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Not authenticated");
    }

    // 1. Double check ownership (security)
    const { data: resource, error: fetchError } = await supabaseAdmin
        .from('resources')
        .select('uploader_id')
        .eq('id', id)
        .single();

    if (fetchError || !resource) {
        throw new Error("Resource not found");
    }

    if (resource.uploader_id !== userId) {
        throw new Error("Not authorized to delete this resource");
    }

    // 2. Extract path from URL (Assuming format: .../storage/v1/object/public/bucket/path)
    // We need the relative path inside the bucket.
    // Example fileUrl: https://[project].supabase.co/storage/v1/object/public/academic-resources/folder/file.pdf
    const bucketName = 'academic-resources';
    const urlParts = fileUrl.split(`${bucketName}/`);
    const filePath = urlParts[urlParts.length - 1];

    if (!filePath) {
        throw new Error("Could not determine file path for deletion");
    }

    // 3. Delete from Storage
    const { error: storageError } = await supabaseAdmin
        .storage
        .from(bucketName)
        .remove([filePath]);

    if (storageError) {
        console.error("Storage Deletion Error:", storageError);
        // We continue anyway to try and clean up the database if storage fails (or file was already gone)
    }

    // 4. Delete from Database
    const { error: dbError } = await supabaseAdmin
        .from('resources')
        .delete()
        .eq('id', id);

    if (dbError) {
        console.error("DB Deletion Error:", dbError);
        throw new Error(`Failed to delete resource record: ${dbError.message}`);
    }

    revalidatePath('/dashboard');
    revalidatePath('/resources');
    return { success: true };
}
