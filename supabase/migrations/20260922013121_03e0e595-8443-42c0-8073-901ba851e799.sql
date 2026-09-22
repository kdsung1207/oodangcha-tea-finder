CREATE POLICY "No direct client access to signups"
ON public.signups
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);