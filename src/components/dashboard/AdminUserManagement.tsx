import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  User,
  Code,
  TestTube,
  Eye,
  Edit,
  Trash2,
  Sparkles,
  UserPlus
} from "lucide-react";
import { AdminUser } from "@/hooks/useAdminData";
import { toast } from "@/hooks/use-toast";
import AddUserDialog from "./AddUserDialog";

type AppRole = 'admin' | 'project_manager' | 'developer' | 'tester' | 'viewer';

interface AdminUserManagementProps {
  users: AdminUser[];
  loading: boolean;
  onRefresh: () => void;
  createUser: (userData: {
    first_name: string;
    last_name: string;
    role: string;
    email: string;
  }) => Promise<{ data: any; error: any }>;
  updateUser: (userId: string, updates: Partial<AdminUser>) => Promise<{ data: any; error: any }>;
  deleteUser: (userId: string) => Promise<{ error: any }>;
}

const AdminUserManagement = ({ 
  users, 
  loading, 
  onRefresh, 
  createUser, 
  updateUser, 
  deleteUser 
}: AdminUserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
      admin: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
      project_manager: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
      developer: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
      tester: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
      viewer: "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
    };
    return colors[role as keyof typeof colors] || "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const { error } = await updateUser(userId, { role: newRole as AppRole });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update user role.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Role Updated",
          description: "User role has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const { error } = await deleteUser(userId);
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to delete user.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "User Deleted",
            description: "User has been deleted successfully.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600">Loading team members...</p>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-xl">
            <CardContent className="p-6">
              <div className="animate-pulse flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-gray-200 to-gray-300 h-12 w-12"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Team Management
              </h2>
              <p className="text-gray-600">Manage user roles and permissions</p>
            </div>
          </div>
        </div>
        <AddUserDialog />
      </div>

      {/* Enhanced Search and Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-white/30 shadow-lg"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="project_manager">Project Manager</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="tester">Tester</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Users Grid */}
      <div className="grid gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14 ring-4 ring-white/50 shadow-lg">
                      <AvatarImage src={user.avatar_url || ''} alt={user.first_name || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white font-semibold">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {user.first_name} {user.last_name}
                      </h3>
                      <Badge className={`${getRoleColor(user.role)} text-xs font-medium shadow-lg`}>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">
                            {user.role.replace('_', ' ')}
                          </span>
                        </div>
                      </Badge>
                    </div>
                    <p className="text-gray-600 font-medium">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Member since {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Select 
                    value={user.role} 
                    onValueChange={(value) => handleRoleUpdate(user.id, value)}
                  >
                    <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-white/30 shadow-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="project_manager">Project Manager</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="tester">Tester</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 bg-white/80 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {filteredUsers.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">No team members found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || roleFilter !== "all" 
                  ? "Try adjusting your search criteria or filters to find team members."
                  : "Your team is empty. Add your first team member to get started."}
              </p>
            </div>
            {(!searchTerm && roleFilter === "all") && (
              <AddUserDialog />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUserManagement;
