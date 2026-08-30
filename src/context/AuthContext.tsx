"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  exam: string;
  subscription: string;
  currentChapter: number;
  createdAt: any;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isMockMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    exam: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapProfile = (profile: any): UserProfile => ({
  uid: profile.id,
  name: profile.name ?? "",
  email: profile.email ?? "",
  exam: profile.exam_type ?? profile.exam ?? "jee",
  subscription: profile.subscription ?? "inactive",
  currentChapter: Number(
    profile.current_chapter_number ?? profile.currentChapter ?? 1,
  ),
  createdAt: profile.created_at ?? profile.createdAt ?? null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserProfile = async (userId: string) => {
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Failed to load profile:", profileError.message);
      return null;
    }

    return data ? mapProfile(data) : null;
  };

  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      setLoading(true);
      setError(null);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("Failed to get Supabase session:", sessionError.message);
      }

      const sessionUser = sessionData?.session?.user;
      if (sessionUser) {
        const profile = await loadUserProfile(sessionUser.id);
        setUser(profile);
      } else {
        setUser(null);
      }

      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setLoading(true);
          setError(null);

          const user = session?.user;
          if (user) {
            const profile = await loadUserProfile(user.id);
            setUser(profile);
          } else {
            setUser(null);
          }

          setLoading(false);
        },
      );

      authSubscription = listener?.subscription ?? null;
      setLoading(false);
    };

    initializeAuth();

    return () => {
      authSubscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      throw new Error(authError.message || "Failed to log in");
    }

    const userId = data.session?.user.id;
    if (!userId) {
      setLoading(false);
      throw new Error("Login succeeded but no user session was returned.");
    }

    const profile = await loadUserProfile(userId);
    setUser(profile);
    setLoading(false);
  };

  const signup = async (
    name: string,
    email: string,
    exam: string,
    password: string,
  ) => {
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          exam_type: exam,
        },
      },
    });

    if (authError) {
      setLoading(false);
      throw new Error(authError.message || "Failed to register account");
    }

    const userId = data.user?.id ?? data.session?.user?.id;

    if (!userId) {
      setLoading(false);
      throw new Error("Signup succeeded but no user was returned.");
    }

    // Wait briefly for the database trigger to create the profile
    let loadedProfile = null;

    for (let i = 0; i < 5; i++) {
      loadedProfile = await loadUserProfile(userId);

      if (loadedProfile) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setUser(loadedProfile);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setLoading(false);
      throw new Error(signOutError.message || "Failed to log out");
    }

    setUser(null);
    setLoading(false);
  };

  const refreshUserProfile = async () => {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) {
      console.error("Failed to refresh session:", sessionError.message);
      return;
    }

    const userId = sessionData?.session?.user.id;
    if (!userId) return;

    const profile = await loadUserProfile(userId);
    if (profile) {
      setUser(profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isMockMode: false,
        login,
        signup,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
