import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  Trash2
} from "lucide-react";
import { AdminProject } from "@/hooks/useAdminData";
import { toast } from "@/hooks/use-toast";
import AddProjectDialog from "./AddProjectDialog";

interface AdminProjectManagementProps {
  projects: AdminProject[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  canManageAll: boolean;
  createProject: (projectData: { name: string; description?: string; status: string; }) => Promise<{ data: any; error: any; }>;
  updateProject: (projectId: string, updates: Partial<AdminProject>) => Promise<{ data: any; error: any; }>;
  deleteProject: (projectId: string) => Promise<{ error: any; }>;
}

const AdminProjectManagement = ({ 
  projects, 
  loading, 
  onRefresh, 
  canManageAll, 
  createProject, 
  updateProject, 
  deleteProject 
}: AdminProjectManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      planning: "bg-blue-100 text-blue-800",
      onhold: "bg-yellow-100 text-yellow-800",
      completed: "bg-gray-100 text-gray-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <CheckCircle className="h-4 w-4" />,
      planning: <Clock className="h-4 w-4" />,
      onhold: <AlertCircle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      const result = await createProject(projectData);
      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to create project.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Project Created",
          description: "New project has been created successfully.",
        });
        await onRefresh();
      }
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const handleStatusUpdate = async (projectId: string, newStatus: string) => {
    try {
      const result = await updateProject(projectId, { status: newStatus });
      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to update project status.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Project Updated",
          description: "Project status has been updated successfully.",
        });
        await onRefresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const result = await deleteProject(projectId);
      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to delete project.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Project Deleted",
          description: "Project has been deleted successfully.",
        });
        await onRefresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="onhold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {canManageAll && (
          <AddProjectDialog onAddProject={handleCreateProject} />
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{project.status}</span>
                      </div>
                    </Badge>
                  </div>
                  <p className="text-gray-600">{project.description}</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.owner_name}`} alt={project.owner_name} />
                  <AvatarFallback>{(project.owner_name || 'U').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{project.members_count || 0} members</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{project.tasks_count || 0} tasks</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Owner:</span>
                  <span className="text-sm font-medium">{project.owner_name}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Select 
                    value={project.status} 
                    onValueChange={(value) => handleStatusUpdate(project.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="onhold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  {canManageAll && (
                    <>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No projects available."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminProjectManagement;
