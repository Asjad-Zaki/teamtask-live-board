
import { useMemo } from 'react';

interface RolePermissions {
  // User Management
  canManageUsers: boolean;
  canViewUsers: boolean;
  canAssignRoles: boolean;
  
  // Project Management
  canCreateProjects: boolean;
  canEditProjects: boolean;
  canDeleteProjects: boolean;
  canViewProjects: boolean;
  canManageAllProjects: boolean;
  
  // Task Management
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canViewTasks: boolean;
  canDragTasks: boolean;
  canAssignTasks: boolean;
  canManageAllTasks: boolean;
  
  // Special Actions
  canComment: boolean;
  canMarkTested: boolean;
  canApproveReview: boolean;
  
  // Access Control
  isReadOnly: boolean;
  canAccessAdminPanel: boolean;
  
  // Display
  roleDisplayName: string;
  roleColor: string;
}

export const useRolePermissions = (userRole: string): RolePermissions => {
  return useMemo(() => {
    const permissions: RolePermissions = {
      // Default values
      canManageUsers: false,
      canViewUsers: false,
      canAssignRoles: false,
      canCreateProjects: false,
      canEditProjects: false,
      canDeleteProjects: false,
      canViewProjects: true,
      canManageAllProjects: false,
      canCreateTasks: false,
      canEditTasks: false,
      canDeleteTasks: false,
      canViewTasks: true,
      canDragTasks: false,
      canAssignTasks: false,
      canManageAllTasks: false,
      canComment: false,
      canMarkTested: false,
      canApproveReview: false,
      isReadOnly: true,
      canAccessAdminPanel: false,
      roleDisplayName: 'Unknown',
      roleColor: 'bg-gray-500'
    };

    switch (userRole) {
      case 'admin':
        return {
          ...permissions,
          // Admin has all permissions
          canManageUsers: true,
          canViewUsers: true,
          canAssignRoles: true,
          canCreateProjects: true,
          canEditProjects: true,
          canDeleteProjects: true,
          canManageAllProjects: true,
          canCreateTasks: true,
          canEditTasks: true,
          canDeleteTasks: true,
          canDragTasks: true,
          canAssignTasks: true,
          canManageAllTasks: true,
          canComment: true,
          canMarkTested: true,
          canApproveReview: true,
          isReadOnly: false,
          canAccessAdminPanel: true,
          roleDisplayName: 'Admin',
          roleColor: 'bg-red-500'
        };

      case 'project_manager':
        return {
          ...permissions,
          canViewUsers: true,
          canCreateProjects: true,
          canEditProjects: true,
          canDeleteProjects: false, // Only admin can delete projects
          canManageAllProjects: true,
          canCreateTasks: true,
          canEditTasks: true,
          canDeleteTasks: true,
          canDragTasks: true,
          canAssignTasks: true,
          canManageAllTasks: true,
          canComment: true,
          canMarkTested: true,
          canApproveReview: true,
          isReadOnly: false,
          canAccessAdminPanel: true,
          roleDisplayName: 'Project Manager',
          roleColor: 'bg-blue-500'
        };

      case 'developer':
        return {
          ...permissions,
          canCreateTasks: true,
          canEditTasks: true,
          canDragTasks: true,
          canComment: true,
          isReadOnly: false,
          roleDisplayName: 'Developer',
          roleColor: 'bg-green-500'
        };

      case 'tester':
        return {
          ...permissions,
          canEditTasks: true, // Can update task status
          canDragTasks: true,
          canComment: true,
          canMarkTested: true,
          isReadOnly: false,
          roleDisplayName: 'Tester',
          roleColor: 'bg-yellow-500'
        };

      case 'viewer':
        return {
          ...permissions,
          // Viewer has minimal permissions (mostly defaults)
          roleDisplayName: 'Viewer',
          roleColor: 'bg-gray-500'
        };

      default:
        return {
          ...permissions,
          roleDisplayName: userRole || 'Unknown',
          roleColor: 'bg-gray-500'
        };
    }
  }, [userRole]);
};
