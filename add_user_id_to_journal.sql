-- 1. Add user_id column to journal table
ALTER TABLE public.journal ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- 2. Update existing rows with Jacques' User ID
-- Jacques' ID: 872056b1-5aad-439b-a4cb-7eb8a84981c4
UPDATE public.journal SET user_id = '872056b1-5aad-439b-a4cb-7eb8a84981c4' WHERE user_id IS NULL;

-- 3. If RLS is enabled, update policies to ensure functionality
-- Check if RLS is enabled on journal (just in case)
-- ALTER TABLE public.journal ENABLE ROW LEVEL SECURITY;

-- If you have the "Allow authenticated users to insert to journal" policy, 
-- it should still work as it returns 'true', but tracking is better now.
-- We don't need to change the policy, but we'll ensure it exists.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'journal' AND policyname = 'Allow authenticated users to insert to journal'
    ) THEN
        CREATE POLICY "Allow authenticated users to insert to journal" ON public.journal FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
END $$;
