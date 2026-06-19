"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isMockMode } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Loading state showing a physics-themed loader
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-dark-bg flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 physics-grid opacity-20"></div>
        
        {/* Core atom spinner */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Protons/Neutrons Center */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-physics-purple to-physics-blue blur-xs z-10 animate-pulse"></div>
          
          {/* Orbiting Electrons */}
          <div className="absolute inset-0 rounded-full border border-physics-purple/30 border-dashed animate-spin [animation-duration:3s]">
            <div className="w-2.5 h-2.5 rounded-full bg-physics-purple absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="absolute inset-1.5 rounded-full border border-physics-blue/20 border-dashed animate-spin [animation-duration:2s] [animation-direction:reverse] rotate-45">
            <div className="w-2 h-2 rounded-full bg-physics-blue absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="absolute inset-3 rounded-full border border-indigo-500/10 border-dashed animate-spin [animation-duration:4s] -rotate-45">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <h3 className="font-display font-bold text-white text-lg mt-6 tracking-wide animate-pulse">
          Syncing Quantum States...
        </h3>
        <p className="text-slate-500 text-xs mt-1 font-medium">
          Verifying secure credentials session
        </p>
      </div>
    );
  }

  // Render children only when user exists
  if (user) {
    return (
      <div className="relative min-h-[calc(100vh-5rem)] bg-dark-bg">
        {/* Header notification if in Mock Mode */}
        {isMockMode && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-4 text-center text-xs font-semibold text-amber-400 relative z-40">
            You are viewing the dashboard in offline Mock Mode. Sessions are preserved in your local browser storage.
          </div>
        )}
        {children}
      </div>
    );
  }

  // Fallback while router redirects
  return null;
}
