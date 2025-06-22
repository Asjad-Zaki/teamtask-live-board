
-- Update the role for zakicareers.cse@gmail.com to admin
UPDATE public.profiles 
SET role = 'admin'::public.app_role,
    updated_at = now()
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'zakicareers.cse@gmail.com'
);
