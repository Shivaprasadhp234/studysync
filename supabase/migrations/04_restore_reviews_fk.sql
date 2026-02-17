-- RESTORE MISSING FOREIGN KEY
-- This cross-table relationship was dropped in a previous migration but not re-added.
-- It is required for the gallery join to work.

ALTER TABLE public.reviews
ADD CONSTRAINT reviews_resource_id_fkey 
FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;

