
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          first_name: '',
          last_name: ''
        }
      }
    });
    if (error) throw error;
  };

  const loginAsGuest = async () => {
    try {
      // تنظيف الجلسة الحالية أولاً
      await supabase.auth.signOut();
      
      // إنشاء حساب زائر جديد مع معرف فريد
      const guestEmail = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@temp.com`;
      const guestPassword = `guest${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
      
      console.log('Creating guest account:', guestEmail);
      
      const { data, error } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
        options: {
          data: {
            first_name: 'زائر',
            last_name: 'مؤقت',
            is_guest: true
          },
          emailRedirectTo: undefined // تجنب إرسال إيميل تأكيد
        }
      });
      
      if (error) {
        console.error('Guest signup error:', error);
        throw error;
      }
      
      console.log('Guest account created successfully:', data);
      
      // تسجيل دخول مباشر بالحساب الجديد
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword
      });
      
      if (loginError) {
        console.error('Guest login error:', loginError);
        throw loginError;
      }
      
    } catch (error) {
      console.error('Guest login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setCurrentUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    session,
    login,
    register,
    loginAsGuest,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
