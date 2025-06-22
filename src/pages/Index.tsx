
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/dashboard/Dashboard";
import LandingPage from "@/components/LandingPage";

const Index = () => {
  const { user, profile, loading } = useAuth();

  console.log('Index render - user:', user?.email, 'profile role:', profile?.role, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto shadow-lg"></div>
          <div className="space-y-2">
            <p className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Loading TeamTasker...</p>
            <p className="text-gray-600">Setting up your workspace</p>
          </div>
        </div>
      </div>
    );
  }

  if (user && profile) {
    console.log('Rendering dashboard for user:', user.email, 'with role:', profile.role);
    
    // Additional debugging to check the exact role value
    if (user.email === 'zakicareers.cse@gmail.com') {
      console.log('Admin user detected:', {
        email: user.email,
        profileRole: profile.role,
        roleType: typeof profile.role,
        isAdmin: profile.role === 'admin'
      });
    }
    
    return (
      <Dashboard 
        user={{
          id: user.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
          email: user.email || '',
          role: profile.role,
          avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
        }}
        onLogout={() => {}} // Will be handled by useAuth
      />
    );
  }

  console.log('Rendering landing page');
  return <LandingPage />;
};

export default Index;
