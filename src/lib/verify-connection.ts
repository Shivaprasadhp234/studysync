import { createSupabaseServerClient } from './supabase';

/**
 * PRODUCTION CONNECTION VERIFICATION SCRIPT
 * Run this to ensure your environment variables are correctly 
 * hitting the live Supabase instance.
 */
export async function verifySupabaseConnection() {
    console.log("🔍 Testing Supabase Connection...");

    try {
        const supabase = await createSupabaseServerClient();

        const { data, error } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);

        if (error) {
            return {
                success: false,
                message: "❌ Database connection failed.",
                error: error.message,
                hint: "Check your SUPABASE_SERVICE_ROLE_KEY and URL."
            };
        }

        return {
            success: true,
            message: "✅ Successfully connected to Supabase production.",
            data
        };
    } catch (err: any) {
        return {
            success: false,
            message: "❌ An unexpected error occurred.",
            error: err.message
        };
    }
}
