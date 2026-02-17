-- COMPREHENSIVE REVIEWS FIX
-- Run this in the Supabase SQL Editor to resolve the "ON CONFLICT" error.

-- 1. Ensure columns are the correct type (Text for Clerk IDs)
DO $$ BEGIN
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'user_id') = 'uuid' THEN
        ALTER TABLE public.reviews ALTER COLUMN user_id TYPE text;
    END IF;
END $$;

-- 2. Clean up any existing duplicate reviews (keep only the latest one)
DELETE FROM public.reviews a
USING public.reviews b
WHERE a.id < b.id 
  AND a.user_id = b.user_id 
  AND a.resource_id = b.resource_id;

-- 3. Add the Unique Constraint (Enables UPSERT logic)
ALTER TABLE public.reviews 
DROP CONSTRAINT IF EXISTS unique_user_resource_review;

ALTER TABLE public.reviews 
ADD CONSTRAINT unique_user_resource_review UNIQUE (user_id, resource_id);

-- 4. Restore Foreign Key to Resources (Enables Gallery Joins)
ALTER TABLE public.reviews 
DROP CONSTRAINT IF EXISTS reviews_resource_id_fkey;

ALTER TABLE public.reviews
ADD CONSTRAINT reviews_resource_id_fkey 
FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;

-- 5. Enable RLS and verify policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can upsert their own reviews') THEN
        CREATE POLICY "Users can upsert their own reviews"
        ON public.reviews FOR ALL
        TO authenticated
        USING (auth.uid()::text = user_id)
        WITH CHECK (auth.uid()::text = user_id);
    END IF;
END $$;
