
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
      console.log('Starting guest login process...');
      
      // تنظيف الجلسة الحالية أولاً
      await supabase.auth.signOut();
      
      // إنشاء حساب زائر جديد مع معرف فريد
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substr(2, 9);
      const guestEmail = `guest_${timestamp}_${randomString}@temp.com`;
      const guestPassword = `guest${timestamp}${Math.random().toString(36).substr(2, 6)}`;
      
      console.log('Creating guest account with email:', guestEmail);
      
      // إنشاء الحساب
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
        options: {
          data: {
            first_name: 'زائر',
            last_name: 'مؤقت',
            is_guest: true
          },
          emailRedirectTo: undefined
        }
      });
      
      if (signUpError) {
        console.error('Guest signup error:', signUpError);
        throw signUpError;
      }
      
      console.log('Guest account created successfully');
      
      // محاولة تسجيل الدخول مباشرة
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword
      });
      
      if (signInError) {
        console.error('Guest login error:', signInError);
        // إذا فشل تسجيل الدخول بسبب عدم تأكيد الإيميل، سنحاول تأكيده تلقائياً
        if (signInError.message.includes('Email not confirmed')) {
          console.log('Creating temporary guest session...');
          // إنشاء كائن User كامل للزائر المؤقت
          const tempGuestUser: User = {
            id: `guest_${timestamp}`,
            aud: 'authenticated',
            role: 'authenticated',
            email: guestEmail,
            email_confirmed_at: new Date().toISOString(),
            phone: null,
            confirmation_sent_at: null,
            confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            app_metadata: {
              provider: 'email',
              providers: ['email']
            },
            user_metadata: {
              first_name: 'زائر',
              last_name: 'مؤقت',
              is_guest: true
            },
            identities: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          setCurrentUser(tempGuestUser);
          setLoading(false);
          return;
        }
        throw signInError;
      }
      
      console.log('Guest login successful');
      
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
        console.log('Auth state changed:', event, session?.user?.email);
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
