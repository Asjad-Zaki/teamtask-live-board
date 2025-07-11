
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notificationSchema, type Notification } from '@/lib/schemas';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const;

// Fetch notifications
export const useNotifications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Validate and parse the data
      const validatedNotifications = z.array(notificationSchema).parse(data || []);
      return validatedNotifications;
    },
    enabled: !!user,
  });
};

// Mark notification as read mutation
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...NOTIFICATIONS_QUERY_KEY, user?.id] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
      console.error('Mark notification as read error:', error);
    },
  });
};

// Create notification mutation
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'created_at'>) => {
      const { error } = await supabase
        .from('notifications')
        .insert([notification]);

      if (error) throw error;
      return notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Create notification error:', error);
    },
  });
};

// Get unread count
export const useUnreadNotificationsCount = () => {
  const { data: notifications = [] } = useNotifications();
  return notifications.filter(n => !n.read).length;
};
