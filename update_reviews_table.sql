-- Update reviews table to support images and fix references
DO $$
BEGIN
    -- Add image_url if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='image_url') THEN
        ALTER TABLE public.reviews ADD COLUMN image_url text;
    END IF;

    -- Fix user_id reference if it points to auth.users (public.profiles is preferred for easy joins in public schema)
    -- This is safer for the app's current logic which joins with profiles
    ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
    ALTER TABLE public.reviews ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
END $$;
