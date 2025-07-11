
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { taskSchema, createTaskSchema, updateTaskSchema, type Task, type CreateTaskInput, type UpdateTaskInput } from '@/lib/schemas';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const TASKS_QUERY_KEY = ['tasks'] as const;

// Fetch tasks
export const useTasks = () => {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Validate and parse the data
      const validatedTasks = z.array(taskSchema).parse(data || []);
      return validatedTasks;
    },
  });
};

// Create task mutation
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (taskData: CreateTaskInput) => {
      // Validate input
      const validatedData = createTaskSchema.parse(taskData);
      
      const taskWithCreator = {
        ...validatedData,
        created_by: user?.id,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskWithCreator])
        .select()
        .single();

      if (error) throw error;
      
      // Validate response
      return taskSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
      console.error('Create task error:', error);
    },
  });
};

// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: UpdateTaskInput }) => {
      // Validate input
      const validatedUpdates = updateTaskSchema.parse(updates);

      const { data, error } = await supabase
        .from('tasks')
        .update(validatedUpdates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      
      // Validate response
      return taskSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
      console.error('Update task error:', error);
    },
  });
};

// Delete task mutation
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
      console.error('Delete task error:', error);
    },
  });
};
