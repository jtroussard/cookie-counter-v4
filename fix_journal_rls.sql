-- Add RLS policy for journal table to allow authenticated users to insert
-- This fixes the 403 error when saving inventory adjustments
CREATE POLICY "Allow authenticated users to insert to journal" ON public.journal FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to read journal" ON public.journal FOR SELECT TO authenticated USING (true);

-- Also allow authenticated users to update products (needed for the trigger to work)
CREATE POLICY "Allow authenticated users to update products" ON public.products FOR UPDATE TO authenticated USING (true);
