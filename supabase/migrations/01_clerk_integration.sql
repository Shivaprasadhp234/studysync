-- 1. DROP EXISTING POLICIES (Required to alter column types)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

DROP POLICY IF EXISTS "Public resources are viewable by everyone." ON public.resources;
DROP POLICY IF EXISTS "Authenticated users can upload resources." ON public.resources;
DROP POLICY IF EXISTS "Users can update own resources." ON public.resources;
DROP POLICY IF EXISTS "Users can delete own resources." ON public.resources;

DROP POLICY IF EXISTS "Reviews are viewable by everyone." ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews." ON public.reviews;

-- 2. DROP FOREIGN KEY CONSTRAINTS (Required due to type change UUID -> TEXT)
-- We must drop constraints that link tables together first.
ALTER TABLE public.resources DROP CONSTRAINT IF EXISTS resources_uploader_id_fkey;
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_resource_id_fkey; -- This one is fine (UUID->UUID), but good practice
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;     -- This one links to profiles(id) so MUST drop

-- 3. ALTER COLUMNS (Change UUID to Text for Clerk IDs)
-- Removing FK reference from profiles to auth.users (Supabase Auth)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Change profiles.id to text
ALTER TABLE public.profiles ALTER COLUMN id TYPE text;

-- Change resources.uploader_id to text
ALTER TABLE public.resources ALTER COLUMN uploader_id TYPE text;

-- Change reviews.user_id to text
ALTER TABLE public.reviews ALTER COLUMN user_id TYPE text;

-- 4. RE-CREATE FOREIGN KEYS (Now that both sides are TEXT)
ALTER TABLE public.resources
  ADD CONSTRAINT resources_uploader_id_fkey 
  FOREIGN KEY (uploader_id) REFERENCES public.profiles(id);

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- 5. RE-CREATE POLICIES (Adapted for Clerk/Text IDs)
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Public resources are viewable by everyone."
  ON public.resources FOR SELECT
  USING ( privacy = 'public' );

CREATE POLICY "Reviews are viewable by everyone."
  ON public.reviews FOR SELECT
  USING ( true );
