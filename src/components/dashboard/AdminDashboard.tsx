import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, Plus, Search, Settings, Users, BarChart3, FolderPlus, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useAdminData } from "@/hooks/useAdminData";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import AdminStats from "./AdminStats";
import AdminUserManagement from "./AdminUserManagement";
import AdminTaskManagement from "./AdminTaskManagement";
import AdminProjectManagement from "./AdminProjectManagement";
import NotificationPanel from "./NotificationPanel";

interface AdminDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const { signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const { 
    users,
    tasks,
    projects,
    loading,
    refreshData,
    createUser,
    updateUser,
    deleteUser,
    createTask,
    updateTask,
    deleteTask,
    createProject,
    updateProject,
    deleteProject
  } = useAdminData();
  const { 
    canViewUsers, 
    canManageUsers, 
    canManageAllTasks, 
    canManageAllProjects 
  } = useRolePermissions(user.role);
  const [activeTab, setActiveTab] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);

  console.log('AdminDashboard render for user:', user.name, 'role:', user.role);

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-gradient-to-r from-red-500 to-pink-500",
      project_manager: "bg-gradient-to-r from-blue-500 to-cyan-500"
    };
    return colors[role as keyof typeof colors] || "bg-gradient-to-r from-blue-500 to-cyan-500";
  };

  const getRoleDisplayName = (role: string) => {
    const names = {
      admin: "Admin",
      project_manager: "Project Manager"
    };
    return names[role as keyof typeof names] || role;
  };

  const handleLogout = async () => {
    console.log('Admin logout initiated');
    try {
      await signOut();
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const handleBackToLanding = () => {
    console.log('Admin back to landing initiated');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Admin Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-white/30 shadow-2xl">
        <div className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToLanding}
              className="bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">TeamTasker</h1>
            </div>
            
            <div className="hidden lg:flex items-center space-x-3">
              <Search className="h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search users, tasks, projects..." 
                className="w-80 bg-white/80 backdrop-blur-sm border-white/40 shadow-lg focus:shadow-xl transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs border-2 border-white shadow-lg">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg border border-white/30">
              <Avatar className="h-9 w-9 ring-2 ring-white/50 shadow-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <Badge className={`${getRoleColor(user.role)} text-white text-xs border-0 shadow-lg`}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-7">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-7">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Welcome, {getRoleDisplayName(user.role)} {user.name.split(' ')[0]}!
              </h2>
              <p className="text-gray-600">
                Here's an overview of what's happening across your teams and projects.
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl rounded-xl p-2">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="tasks" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                <AdminStats 
                  users={users}
                  tasks={tasks}
                  projects={projects}
                  loading={loading}
                  canViewUsers={canViewUsers}
                />
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                <AdminUserManagement 
                  users={users}
                  loading={loading}
                  onRefresh={refreshData}
                  createUser={createUser}
                  updateUser={updateUser}
                  deleteUser={deleteUser}
                />
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                <AdminTaskManagement 
                  tasks={tasks}
                  loading={loading}
                  onRefresh={refreshData}
                  canManageAll={canManageAllTasks}
                  createTask={createTask}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                <AdminProjectManagement 
                  projects={projects}
                  loading={loading}
                  onRefresh={refreshData}
                  canManageAll={canManageAllProjects}
                  createProject={createProject}
                  updateProject={updateProject}
                  deleteProject={deleteProject}
                />
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Notification Panel */}
        {showNotifications && (
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
