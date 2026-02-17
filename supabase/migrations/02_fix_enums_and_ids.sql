-- 1. ADAPT RESOURCE TYPE ENUM
-- We need to add the missing types used in the UI
-- Note: 'ALTER TYPE ... ADD VALUE' cannot be run inside a transaction in some Postgres versions, 
-- but Supabase migrations usually handle this.

-- Let's check for existing values and add what's missing
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'resource_type_enum' AND e.enumlabel = 'Question Paper') THEN
        ALTER TYPE public.resource_type_enum ADD VALUE 'Question Paper';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'resource_type_enum' AND e.enumlabel = 'Solution') THEN
        ALTER TYPE public.resource_type_enum ADD VALUE 'Solution';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'resource_type_enum' AND e.enumlabel = 'Project Report') THEN
        ALTER TYPE public.resource_type_enum ADD VALUE 'Project Report';
    END IF;
END $$;

-- 2. ENSURE ID TYPES ARE TEXT (For Clerk Integration)
-- This is a safety check in case the previous migration didn't fully apply or was overridden
DO $$ BEGIN
    -- Profiles ID to Text
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'id') = 'uuid' THEN
        ALTER TABLE public.profiles ALTER COLUMN id TYPE text;
    END IF;
    
    -- Resources Uploader ID to Text
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'uploader_id') = 'uuid' THEN
        ALTER TABLE public.resources ALTER COLUMN uploader_id TYPE text;
    END IF;
    
    -- Reviews User ID to Text
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'user_id') = 'uuid' THEN
        ALTER TABLE public.reviews ALTER COLUMN user_id TYPE text;
    END IF;
END $$;
