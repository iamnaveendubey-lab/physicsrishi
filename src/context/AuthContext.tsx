"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword as fbSignIn, 
  createUserWithEmailAndPassword as fbCreateUser, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, isMockFirebase } from "@/lib/firebase";

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
  signup: (name: string, email: string, exam: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Auth state
  useEffect(() => {
    if (isMockFirebase) {
      // Mock Mode: check localStorage for mock user session
      const stored = localStorage.getItem("physicsrishi_session");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem("physicsrishi_session");
        }
      }
      setLoading(false);
      return;
    }

    if (!auth || !db) return;

    // Firebase Mode: listen to Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError(null);
      
      if (firebaseUser) {
        try {
          const userDocRef = doc(db!, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUser(userDoc.data() as UserProfile);
          } else {
            // Fallback if Auth user exists but Firestore document was not created or deleted
            const fallbackProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "Student",
              email: firebaseUser.email || "",
              exam: "jee",
              subscription: "inactive",
              currentChapter: 1,
              createdAt: new Date(),
            };
            setUser(fallbackProfile);
          }
        } catch (err: any) {
          console.error("Error fetching Firestore user profile:", err);
          setError(err.message || "Failed to load user profile");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    if (isMockFirebase) {
      // Mock Mode login: Check if user exists in local accounts list
      const accountsRaw = localStorage.getItem("physicsrishi_mock_accounts");
      const accounts = accountsRaw ? JSON.parse(accountsRaw) : [];
      const match = accounts.find((acc: any) => acc.email === email && acc.password === password);

      if (match) {
        const userSession: UserProfile = {
          uid: match.uid,
          name: match.name,
          email: match.email,
          exam: match.exam,
          subscription: "inactive",
          currentChapter: 1,
          createdAt: match.createdAt,
        };
        localStorage.setItem("physicsrishi_session", JSON.stringify(userSession));
        setUser(userSession);
        setLoading(false);
      } else {
        setLoading(false);
        throw new Error("Invalid email or password (Mock Mode)");
      }
      return;
    }

    if (!auth) throw new Error("Firebase Auth is not initialized");

    try {
      await fbSignIn(auth, email, password);
    } catch (err: any) {
      setLoading(false);
      throw new Error(err.message || "Failed to log in");
    }
  };

  // Signup handler
  const signup = async (name: string, email: string, exam: string, password: string) => {
    setLoading(true);
    setError(null);

    if (isMockFirebase) {
      // Mock Mode signup: Save account locally
      const accountsRaw = localStorage.getItem("physicsrishi_mock_accounts");
      const accounts = accountsRaw ? JSON.parse(accountsRaw) : [];
      
      if (accounts.some((acc: any) => acc.email === email)) {
        setLoading(false);
        throw new Error("Account with this email already exists (Mock Mode)");
      }

      const uid = `mock_uid_${Math.random().toString(36).substr(2, 9)}`;
      const newAccount = {
        uid,
        name,
        email,
        exam,
        password,
        createdAt: new Date().toISOString(),
      };
      
      accounts.push(newAccount);
      localStorage.setItem("physicsrishi_mock_accounts", JSON.stringify(accounts));
      
      const userSession: UserProfile = {
        uid,
        name,
        email,
        exam,
        subscription: "inactive",
        currentChapter: 1,
        createdAt: newAccount.createdAt,
      };
      
      localStorage.setItem("physicsrishi_session", JSON.stringify(userSession));
      setUser(userSession);
      setLoading(false);
      return;
    }

    if (!auth || !db) throw new Error("Firebase SDK is not initialized");

    try {
      // Create user in Firebase Auth
      const credential = await fbCreateUser(auth, email, password);
      const { user: fbUser } = credential;

      const profileData: UserProfile = {
        uid: fbUser.uid,
        name,
        email,
        exam,
        subscription: "inactive",
        currentChapter: 1,
        createdAt: serverTimestamp(),
      };

      // Create document in Firestore
      await setDoc(doc(db!, "users", fbUser.uid), profileData);
      
      // Update state
      setUser(profileData);
    } catch (err: any) {
      setLoading(false);
      throw new Error(err.message || "Failed to register account");
    }
  };

  // Logout handler
  const logout = async () => {
    setLoading(true);
    setError(null);

    if (isMockFirebase) {
      localStorage.removeItem("physicsrishi_session");
      setUser(null);
      setLoading(false);
      return;
    }

    if (!auth) throw new Error("Firebase Auth is not initialized");

    try {
      await fbSignOut(auth);
      setUser(null);
    } catch (err: any) {
      setLoading(false);
      throw new Error(err.message || "Failed to log out");
    }
  };

  const refreshUserProfile = async () => {
    if (isMockFirebase) {
      const stored = localStorage.getItem("physicsrishi_session");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse mock session during refresh:", e);
        }
      }
      return;
    }

    if (!auth || !db || !auth.currentUser) return;
    
    try {
      const userDocRef = doc(db!, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUser(userDoc.data() as UserProfile);
      }
    } catch (err) {
      console.error("Failed to refresh live user profile:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isMockMode: isMockFirebase,
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
