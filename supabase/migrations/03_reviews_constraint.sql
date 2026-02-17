-- 1. ADD UNIQUE CONSTRAINT TO REVIEWS
-- This ensures a user can only review a specific resource once.
-- Subsequent attempts will update the existing review (UPSERT).

ALTER TABLE public.reviews 
ADD CONSTRAINT unique_user_resource_review UNIQUE (user_id, resource_id);

-- 2. NOTIFY USER
-- This migration should be applied in the Supabase SQL Editor.
