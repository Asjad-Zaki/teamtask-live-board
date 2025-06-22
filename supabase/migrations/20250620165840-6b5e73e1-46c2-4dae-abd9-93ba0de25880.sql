
-- Create the app_role enum type first
CREATE TYPE public.app_role AS ENUM ('admin', 'project_manager', 'developer', 'tester', 'viewer');

-- Drop the default first, then change the type, then set new default
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN role TYPE public.app_role USING 
  CASE 
    WHEN role = 'admin' THEN 'admin'::public.app_role
    WHEN role = 'project_manager' THEN 'project_manager'::public.app_role
    WHEN role = 'developer' THEN 'developer'::public.app_role
    WHEN role = 'tester' THEN 'tester'::public.app_role
    WHEN role = 'viewer' THEN 'viewer'::public.app_role
    ELSE 'developer'::public.app_role
  END;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'developer'::public.app_role;

-- Create user_roles table for proper RBAC
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1
$$;

-- Update tasks table RLS policies for role-based access
DROP POLICY IF EXISTS "Users can view tasks based on role" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks based on role" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks based on role" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks based on role" ON public.tasks;

-- Enable RLS on tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policy for viewing tasks (all authenticated users can view)
CREATE POLICY "Users can view tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (true);

-- Policy for creating tasks (admin, project_manager, developer)
CREATE POLICY "Admin and PM can create tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role) OR
  public.has_role(auth.uid(), 'project_manager'::public.app_role) OR
  public.has_role(auth.uid(), 'developer'::public.app_role)
);

-- Policy for updating tasks (admin, project_manager, developer, tester)
CREATE POLICY "Users can update tasks based on role"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role) OR
  public.has_role(auth.uid(), 'project_manager'::public.app_role) OR
  public.has_role(auth.uid(), 'developer'::public.app_role) OR
  public.has_role(auth.uid(), 'tester'::public.app_role)
);

-- Policy for deleting tasks (admin, project_manager only)
CREATE POLICY "Admin and PM can delete tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role) OR
  public.has_role(auth.uid(), 'project_manager'::public.app_role)
);

-- Create projects table for proper project management
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'planning', 'onhold', 'completed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    due_date DATE
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Project access policies
CREATE POLICY "Users can view projects"
ON public.projects
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin and PM can create projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role) OR
  public.has_role(auth.uid(), 'project_manager'::public.app_role)
);

CREATE POLICY "Admin and PM can update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role) OR
  public.has_role(auth.uid(), 'project_manager'::public.app_role)
);

CREATE POLICY "Admin can delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Add project_id to tasks table
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id);

-- Enable realtime for real-time updates
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
