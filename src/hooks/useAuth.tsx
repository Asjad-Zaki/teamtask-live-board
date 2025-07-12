
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useProfile, useSignIn, useSignUp, useSignOut, useUpdateProfile } from '@/hooks/queries/useAuth';
import type { Profile, SignInInput, SignUpInput } from '@/lib/schemas';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string; role: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Use React Query hooks
  const { data: profile } = useProfile(user?.id);
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const signOutMutation = useSignOut();
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    console.log('Setting up auth listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'Session:', session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      if (!session) {
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: { firstName: string; lastName: string; role: string }) => {
    const signUpData: SignUpInput = {
      email,
      password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role as any,
    };

    return new Promise<{ error: any }>((resolve) => {
      signUpMutation.mutate(signUpData, {
        onSuccess: () => resolve({ error: null }),
        onError: (error) => resolve({ error })
      });
    });
  };

  const signIn = async (email: string, password: string) => {
    const signInData: SignInInput = { email, password };

    return new Promise<{ error: any }>((resolve) => {
      signInMutation.mutate(signInData, {
        onSuccess: () => resolve({ error: null }),
        onError: (error) => resolve({ error })
      });
    });
  };

  const signOut = async () => {
    return new Promise<void>((resolve) => {
      signOutMutation.mutate(undefined, {
        onSuccess: () => resolve(),
        onError: () => resolve() // Still resolve to clear local state
      });
    });
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    return new Promise<{ error: any }>((resolve) => {
      updateProfileMutation.mutate({ userId: user.id, updates }, {
        onSuccess: () => resolve({ error: null }),
        onError: (error) => resolve({ error })
      });
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile: profile || null,
      session,
      loading: loading || updateProfileMutation.isPending,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
