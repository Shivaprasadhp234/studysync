-- Add is_admin column to profiles if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id TEXT NOT NULL,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    
    -- Ensure at least one of resource_id or review_id is present
    CONSTRAINT report_target_check CHECK (
        (resource_id IS NOT NULL AND review_id IS NULL) OR
        (resource_id IS NULL AND review_id IS NOT NULL)
    )
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create reports"
ON public.reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = reporter_id);

CREATE POLICY "Admins can view all reports"
ON public.reports FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()::text AND is_admin = true
    )
);

CREATE POLICY "Admins can update report status"
ON public.reports FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()::text AND is_admin = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()::text AND is_admin = true
    )
);
