
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { profileSchema, createUserSchema, type Profile, type CreateUserInput } from '@/lib/schemas';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const PROFILES_QUERY_KEY = ['profiles'] as const;

// Fetch all profiles
export const useProfiles = () => {
  return useQuery({
    queryKey: PROFILES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Validate and parse the data
      const validatedProfiles = z.array(profileSchema).parse(data || []);
      return validatedProfiles;
    },
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserInput) => {
      // Validate input
      const validatedData = createUserSchema.parse(userData);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: crypto.randomUUID(),
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          role: validatedData.role,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${validatedData.email}`
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Validate response
      return profileSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
      console.error('Create user error:', error);
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      
      // Validate response
      return profileSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
      console.error('Update user error:', error);
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
      console.error('Delete user error:', error);
    },
  });
};
