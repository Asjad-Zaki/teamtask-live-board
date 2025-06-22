
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, Plus, Search, Settings, Users, Shield, Eye, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import KanbanBoard from "./KanbanBoard";
import UserManagement from "./UserManagement";
import ProjectOverview from "./ProjectOverview";
import NotificationPanel from "./NotificationPanel";
import AddTaskDialog from "./AddTaskDialog";
import AdminDashboard from "./AdminDashboard";

interface DashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  onLogout: () => void;
}

const Dashboard = ({ user }: DashboardProps) => {
  const { signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState("tasks");
  const [showNotifications, setShowNotifications] = useState(false);

  console.log('Dashboard render - user role:', user.role);

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-gradient-to-r from-red-500 to-pink-500",
      project_manager: "bg-gradient-to-r from-blue-500 to-cyan-500", 
      developer: "bg-gradient-to-r from-green-500 to-emerald-500",
      tester: "bg-gradient-to-r from-yellow-500 to-orange-500",
      viewer: "bg-gradient-to-r from-gray-500 to-slate-500"
    };
    return colors[role as keyof typeof colors] || "bg-gradient-to-r from-gray-500 to-slate-500";
  };

  const getRoleDisplayName = (role: string) => {
    const names = {
      admin: "Admin",
      project_manager: "Project Manager",
      developer: "Developer",
      tester: "Tester",
      viewer: "Viewer"
    };
    return names[role as keyof typeof names] || role;
  };

  // Role-based permissions
  const permissions = {
    canManageUsers: user.role === "admin",
    canCreateProjects: user.role === "admin" || user.role === "project_manager",
    canDeleteProjects: user.role === "admin",
    canCreateTasks: user.role === "admin" || user.role === "project_manager" || user.role === "developer",
    canDeleteTasks: user.role === "admin" || user.role === "project_manager",
    canEditTasks: user.role === "admin" || user.role === "project_manager" || user.role === "developer" || user.role === "tester",
    canViewOnly: user.role === "viewer",
    canComment: user.role !== "viewer",
    canMarkTested: user.role === "tester" || user.role === "admin" || user.role === "project_manager"
  };

  const handleLogout = async () => {
    console.log('Logout initiated');
    try {
      await signOut();
      // Small delay to allow auth state to update
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const handleBackToLanding = () => {
    console.log('Back to landing initiated');
    // Force navigation to landing page
    window.location.href = '/';
  };

  // For Admin and Project Manager users, show the AdminDashboard
  if (user.role === "admin" || user.role === "project_manager") {
    console.log('Rendering AdminDashboard for role:', user.role);
    return <AdminDashboard user={user} />;
  }

  console.log('Rendering regular Dashboard for role:', user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header with 3D design */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToLanding}
              className="bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">TeamTasker</h1>
            </div>
            
            {!permissions.canViewOnly && (
              <div className="hidden md:flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search tasks, projects..." 
                  className="w-64 bg-white/80 backdrop-blur-sm border-white/30 shadow-lg"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs border-2 border-white shadow-lg">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/30">
              <Avatar className="h-8 w-8 ring-2 ring-white/50 shadow-lg">
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
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Welcome back, {user.name.split(' ')[0]}!
              </h2>
              <p className="text-gray-600">
                {permissions.canViewOnly 
                  ? "Here's your read-only view of the projects and tasks."
                  : "Here's what's happening with your projects today."
                }
              </p>
              {permissions.canViewOnly && (
                <div className="mt-2 flex items-center space-x-2 text-amber-600 bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">You have view-only access</span>
                </div>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl rounded-xl p-2">
              <TabsTrigger 
                value="tasks" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
              >
                Task Board
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
              >
                Projects
              </TabsTrigger>
              {permissions.canManageUsers && (
                <TabsTrigger 
                  value="users" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Task Board</h3>
                  {permissions.canCreateTasks && (
                    <AddTaskDialog 
                      trigger={
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                          <Plus className="h-4 w-4 mr-2" />
                          New Task
                        </Button>
                      }
                    />
                  )}
                </div>
                <KanbanBoard user={user} />
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                <ProjectOverview user={user} />
              </div>
            </TabsContent>

            {permissions.canManageUsers && (
              <TabsContent value="users" className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                  <UserManagement user={user} />
                </div>
              </TabsContent>
            )}

            <TabsContent value="settings" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-white/50 shadow-lg">
                    <div>
                      <h4 className="font-semibold text-lg">Your Role</h4>
                      <p className="text-sm text-gray-600">
                        Current access level: {getRoleDisplayName(user.role)}
                      </p>
                    </div>
                    <Badge className={`${getRoleColor(user.role)} text-white border-0 shadow-lg`}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Permissions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: "Create Tasks", enabled: permissions.canCreateTasks },
                        { label: "Edit Tasks", enabled: permissions.canEditTasks },
                        { label: "Delete Tasks", enabled: permissions.canDeleteTasks },
                        { label: "Create Projects", enabled: permissions.canCreateProjects },
                        { label: "Add Comments", enabled: permissions.canComment },
                        { label: "Mark as Tested", enabled: permissions.canMarkTested }
                      ].map((permission, index) => (
                        <div key={index} className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg">
                          <div className={`w-3 h-3 rounded-full shadow-lg ${permission.enabled ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-pink-500'}`}></div>
                          <span className="font-medium">{permission.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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

export default Dashboard;
