
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, Settings, Code, Eye, TestTube } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
}

const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: ""
  });

  const roles = [
    { value: "admin", label: "Admin", icon: <Shield className="h-4 w-4" />, color: "text-red-500" },
    { value: "project_manager", label: "Project Manager", icon: <User className="h-4 w-4" />, color: "text-blue-500" },
    { value: "developer", label: "Developer", icon: <Code className="h-4 w-4" />, color: "text-green-500" },
    { value: "tester", label: "Tester", icon: <TestTube className="h-4 w-4" />, color: "text-yellow-500" },
    { value: "viewer", label: "Viewer", icon: <Eye className="h-4 w-4" />, color: "text-gray-500" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate authentication for user
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || "John Doe",
      email: formData.email,
      role: formData.role || "developer",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
    };

    toast({
      title: "Welcome to TeamTasker!",
      description: `Successfully ${isLogin ? 'logged in' : 'registered'} as ${userData.role.replace('_', ' ')}.`,
    });

    onLogin(userData);
  };

  const demoLogin = (role: string) => {
    const roleNames = {
      admin: "Admin User",
      project_manager: "Project Manager",
      developer: "Developer",
      tester: "Tester",
      viewer: "Viewer"
    };

    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: roleNames[role as keyof typeof roleNames],
      email: `${role}@teamtasker.com`,
      role: role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`
    };

    toast({
      title: "Demo Login Successful!",
      description: `Logged in as ${userData.name} (${role.replace('_', ' ')})`,
    });

    onLogin(userData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to TeamTasker
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Quick Demo</TabsTrigger>
            <TabsTrigger value="auth">Login / Register</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Try Different Roles</CardTitle>
                <CardDescription>
                  Experience the platform from different user perspectives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {roles.map((role) => (
                  <Button
                    key={role.value}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => demoLogin(role.value)}
                  >
                    <div className={`mr-2 ${role.color}`}>{role.icon}</div>
                    Login as {role.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" onClick={() => setIsLogin(true)}>Login</TabsTrigger>
                <TabsTrigger value="register" onClick={() => setIsLogin(false)}>Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="admin@teamtasker.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex items-center">
                              <div className={`mr-2 ${role.color}`}>{role.icon}</div>
                              {role.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
