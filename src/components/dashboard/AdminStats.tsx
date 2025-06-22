
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Shield,
  User,
  Code,
  TestTube,
  Eye,
  FolderOpen
} from "lucide-react";
import { AdminUser, AdminTask, AdminProject } from "@/hooks/useAdminData";

interface AdminStatsProps {
  users: AdminUser[];
  tasks: AdminTask[];
  projects: AdminProject[];
  loading: boolean;
  canViewUsers: boolean;
}

const AdminStats = ({ users, tasks, projects, loading, canViewUsers }: AdminStatsProps) => {
  const userStats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    projectManager: users.filter(u => u.role === 'project_manager').length,
    developer: users.filter(u => u.role === 'developer').length,
    tester: users.filter(u => u.role === 'tester').length,
    viewer: users.filter(u => u.role === 'viewer').length,
  };

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    progress: tasks.filter(t => t.status === 'progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    planning: projects.filter(p => p.status === 'planning').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  const completionRate = taskStats.total > 0 
    ? Math.round((taskStats.done / taskStats.total) * 100) 
    : 0;

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: <Shield className="h-4 w-4" />,
      project_manager: <User className="h-4 w-4" />,
      developer: <Code className="h-4 w-4" />,
      tester: <TestTube className="h-4 w-4" />,
      viewer: <Eye className="h-4 w-4" />
    };
    return icons[role as keyof typeof icons] || <User className="h-4 w-4" />;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-500 text-white",
      project_manager: "bg-blue-500 text-white",
      developer: "bg-green-500 text-white",
      tester: "bg-yellow-500 text-white",
      viewer: "bg-gray-500 text-white"
    };
    return colors[role as keyof typeof colors] || "bg-gray-500 text-white";
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Task Overview</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold">{taskStats.total}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{taskStats.done}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-orange-600">{taskStats.progress}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{completionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Project Overview</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold">{projectStats.total}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{projectStats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Planning</p>
                  <p className="text-2xl font-bold text-orange-600">{projectStats.planning}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-600">{projectStats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Priority Breakdown</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgent</p>
                  <p className="text-xl font-bold text-red-600">{taskStats.urgent}</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High</p>
                  <p className="text-xl font-bold text-orange-600">{taskStats.high}</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Medium</p>
                  <p className="text-xl font-bold text-yellow-600">{taskStats.medium}</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low</p>
                  <p className="text-xl font-bold text-green-600">{taskStats.low}</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Statistics - Only for admins */}
      {canViewUsers && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Team Overview</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{userStats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Role Distribution</p>
                  <div className="space-y-1">
                    {userStats.admin > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge className="bg-red-500 text-white text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                        <span className="text-sm font-medium">{userStats.admin}</span>
                      </div>
                    )}
                    {userStats.projectManager > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-500 text-white text-xs">
                          <User className="h-3 w-3 mr-1" />
                          PM
                        </Badge>
                        <span className="text-sm font-medium">{userStats.projectManager}</span>
                      </div>
                    )}
                    {userStats.developer > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-500 text-white text-xs">
                          <Code className="h-3 w-3 mr-1" />
                          Dev
                        </Badge>
                        <span className="text-sm font-medium">{userStats.developer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Other Roles</p>
                  <div className="space-y-1">
                    {userStats.tester > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge className="bg-yellow-500 text-white text-xs">
                          <TestTube className="h-3 w-3 mr-1" />
                          Tester
                        </Badge>
                        <span className="text-sm font-medium">{userStats.tester}</span>
                      </div>
                    )}
                    {userStats.viewer > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gray-500 text-white text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Viewer
                        </Badge>
                        <span className="text-sm font-medium">{userStats.viewer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
