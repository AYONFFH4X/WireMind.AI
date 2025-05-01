"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { User } from '@supabase/supabase-js'

const useUserAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Initial auth check
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Auth error:", error.message);
          setAuthError(error.message as any);
        }
        
        if (user) {
          console.log('User authenticated:', user.email);
          setUser(user);
        }
      } catch (error: any) {
        console.error("Error fetching user:", error);
        setAuthError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Cleanup subscription
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: 'email profile',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error("Google login error:", error.message);
        setAuthError(error.message as any);
        return { error };
      }
      
      return { data };
    } catch (error: any) {  
      console.error("Sign in error:", error);
      setAuthError(error.message);
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error.message);
        setAuthError(error.message as any)
        return { error };
      }
      return { success: true };
    } catch (error: any) {
      console.error("Sign out error:", error);
      setAuthError(error.message);
      return { error };
    }
  };

  return {
    user,
    loading,
    error: authError,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  };
};

export default useUserAuth;