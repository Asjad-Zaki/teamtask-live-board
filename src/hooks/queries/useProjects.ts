
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { projectSchema, type Project } from '@/lib/schemas';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const PROJECTS_QUERY_KEY = ['projects'] as const;

// Create project input schema
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'planning', 'onhold', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.string().optional(),
});

type CreateProjectInput = z.infer<typeof createProjectSchema>;

// Fetch projects
export const useProjects = () => {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match expected format
      const transformedData = (data || []).map(project => ({
        ...project,
        team_members: [], // Projects table doesn't have team_members yet
        owner_name: 'Unknown', // Will be resolved with joins later
        owner_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown'
      }));
      
      const validatedProjects = z.array(projectSchema).parse(transformedData);
      return validatedProjects;
    },
  });
};

// Create project mutation
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (projectData: CreateProjectInput) => {
      const validatedData = createProjectSchema.parse(projectData);
      
      if (!user) throw new Error('User not authenticated');

      const projectWithOwner = {
        ...validatedData,
        owner_id: user.id,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([projectWithOwner])
        .select()
        .single();

      if (error) throw error;
      
      // Transform to match expected format
      const transformedData = {
        ...data,
        team_members: [],
        owner_name: user?.user_metadata?.first_name || 'Unknown',
        owner_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
      };
      
      return projectSchema.parse(transformedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project',
        variant: 'destructive',
      });
    },
  });
};

// Update project mutation
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, updates }: { projectId: string; updates: Partial<CreateProjectInput> }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      
      // Transform to match expected format
      const transformedData = {
        ...data,
        team_members: [],
        owner_name: 'Unknown',
        owner_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown'
      };
      
      return projectSchema.parse(transformedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update project',
        variant: 'destructive',
      });
    },
  });
};

// Delete project mutation
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      return projectId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete project',
        variant: 'destructive',
      });
    },
  });
};

// Project statistics hook
export const useProjectStats = () => {
  const { data: projects = [] } = useProjects();
  
  return useQuery({
    queryKey: ['project-stats', projects.length],
    queryFn: () => {
      const activeProjects = projects.filter(p => p.status === 'active').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const totalProjects = projects.length;
      
      return {
        activeProjects,
        completedProjects,
        totalProjects,
        completionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
      };
    },
    enabled: projects.length >= 0,
  });
};

export type { CreateProjectInput };
