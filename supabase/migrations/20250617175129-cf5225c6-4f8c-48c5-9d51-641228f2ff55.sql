
-- Create tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'progress', 'review', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assignee_id UUID REFERENCES public.profiles(id),
  assignee_name TEXT,
  assignee_avatar TEXT,
  due_date DATE,
  comments_count INTEGER DEFAULT 0,
  attachments_count INTEGER DEFAULT 0,
  labels TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all tasks"
  ON public.tasks
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create tasks"
  ON public.tasks
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update tasks"
  ON public.tasks
  FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete tasks"
  ON public.tasks
  FOR DELETE
  USING (true);

-- Insert sample data
INSERT INTO public.tasks (title, description, status, priority, assignee_name, assignee_avatar, due_date, comments_count, attachments_count, labels) VALUES
('Implement user authentication', 'Add JWT-based authentication system', 'todo', 'high', 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', '2024-07-25', 3, 2, ARRAY['backend', 'security']),
('Design dashboard wireframes', 'Create wireframes for the main dashboard', 'todo', 'medium', 'Jane Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', '2024-07-28', 1, 0, ARRAY['design', 'ui']),
('Build task management API', 'Create CRUD endpoints for task management', 'progress', 'high', 'Mike Johnson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', '2024-07-30', 5, 1, ARRAY['backend', 'api']),
('Test user registration flow', 'Comprehensive testing of the registration process', 'review', 'medium', 'Sarah Wilson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', '2024-08-02', 2, 0, ARRAY['testing', 'qa']),
('Set up project repository', 'Initialize Git repository and basic project structure', 'done', 'low', 'Alex Brown', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', '2024-07-20', 1, 3, ARRAY['setup', 'devops']),
('Create user profile page', 'Build comprehensive user profile management', 'todo', 'medium', 'Emma Davis', 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', '2024-08-05', 0, 1, ARRAY['frontend', 'ui']),
('Implement notifications system', 'Real-time notifications for task updates', 'progress', 'high', 'Tom Wilson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom', '2024-08-10', 4, 2, ARRAY['backend', 'realtime']),
('Mobile responsive design', 'Ensure app works perfectly on mobile devices', 'review', 'medium', 'Lisa Chen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', '2024-08-15', 3, 0, ARRAY['frontend', 'design']);
