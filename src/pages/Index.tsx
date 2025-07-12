
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

  // If user is authenticated, show dashboard
  if (user) {
    console.log('Rendering dashboard for user:', user.email, 'with profile:', profile);
    
    // Create a fallback profile from user metadata if profile is missing
    const fallbackProfile = profile || {
      id: user.id,
      first_name: user.user_metadata?.first_name || 'User',
      last_name: user.user_metadata?.last_name || '',
      role: user.user_metadata?.role || 'developer',
      avatar_url: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return (
      <Dashboard 
        user={{
          id: user.id,
          name: `${fallbackProfile.first_name || ''} ${fallbackProfile.last_name || ''}`.trim() || 'User',
          email: user.email || '',
          role: fallbackProfile.role,
          avatar: fallbackProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
        }}
        onLogout={() => {}} // Will be handled by useAuth
      />
    );
  }

  console.log('Rendering landing page');
  return <LandingPage />;
};

export default Index;
