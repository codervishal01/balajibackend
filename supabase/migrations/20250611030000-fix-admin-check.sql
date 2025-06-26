
-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE admin_users.user_id = $1
  );
$$;

-- Drop existing policies that might cause recursion
DROP POLICY IF EXISTS "Admins can view and manage contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

-- Create new policies using the security definer function
CREATE POLICY "Admins can view and manage contact messages" ON public.contact_messages 
FOR ALL 
USING (public.is_user_admin(auth.uid()));

CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_user_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_admin(uuid) TO anon;
