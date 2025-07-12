
import { z } from 'zod';

// User/Profile schemas
export const appRoleSchema = z.enum(['admin', 'project_manager', 'developer', 'tester', 'viewer']);

export const profileSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  role: appRoleSchema,
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

// Task schemas
export const taskStatusSchema = z.enum(['todo', 'progress', 'review', 'done']);
export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  assignee_id: z.string().uuid().nullable().optional(),
  assignee_name: z.string().nullable().optional(),
  assignee_avatar: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  labels: z.array(z.string()).nullable().optional(),
  comments_count: z.number().nullable().optional(),
  attachments_count: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  created_by: z.string().uuid().optional(),
});

// Project schemas
export const projectStatusSchema = z.enum(['active', 'planning', 'onhold', 'completed']);
export const projectPrioritySchema = z.enum(['low', 'medium', 'high']);

export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  status: projectStatusSchema,
  priority: projectPrioritySchema,
  owner_id: z.string().uuid(),
  owner_name: z.string(),
  owner_avatar: z.string(),
  team_members: z.array(z.string()),
  due_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Notification schemas
export const notificationTypeSchema = z.enum(['task_completed', 'comment', 'user_added', 'deadline']);

export const notificationSchema = z.object({
  id: z.string().uuid(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  read: z.boolean(),
  created_at: z.string(),
  user_id: z.string().uuid(),
  related_task_id: z.string().uuid().nullable().optional(),
});

// Form validation schemas - Fixed to match form expectations
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  assignee_id: z.string().uuid().optional(),
  due_date: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const createUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: appRoleSchema,
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: appRoleSchema.default('developer'),
});

// Export types
export type Profile = z.infer<typeof profileSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type AppRole = z.infer<typeof appRoleSchema>;
