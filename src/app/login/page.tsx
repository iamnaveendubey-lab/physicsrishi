"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { login, isMockMode } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFormLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in. Please check your credentials.");
      setFormLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-dark-bg min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Orbs */}
      <div className="absolute inset-0 physics-grid opacity-20 z-0"></div>
      <div className="absolute top-[20%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-physics-purple/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[25vw] h-[25vw] rounded-full bg-physics-blue/10 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-8 h-8 rounded-full border-2 border-physics-purple flex items-center justify-center relative">
              <div className="w-2.5 h-2.5 rounded-full bg-physics-blue"></div>
              <div className="absolute inset-0 rounded-full border border-physics-blue/50 border-dashed animate-spin [animation-duration:8s]"></div>
            </div>
            <span className="font-display font-black text-xl text-white">Physicsrishi</span>
          </Link>
          <h2 className="font-display text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-2">
            Continue mastering your JEE & NEET Physics concepts
          </p>

          {isMockMode && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-450 animate-pulse"></span>
              Local Mock Mode Active (Local Storage)
            </div>
          )}
        </div>

        <div className="glassmorphism rounded-3xl p-8 border border-dark-border/40 shadow-2xl">
          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm font-medium">
              <div className="flex gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-350 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={formLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/60 rounded-xl text-white text-sm focus:outline-none focus:border-physics-purple transition-all placeholder-slate-600 disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-350">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-physics-purple hover:underline">
                  Forgot Password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={formLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/60 rounded-xl text-white text-sm focus:outline-none focus:border-physics-purple transition-all placeholder-slate-600 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                disabled={formLoading}
                className="h-4 w-4 rounded border-dark-border/60 bg-dark-bg/60 text-physics-purple focus:ring-physics-purple/30 disabled:opacity-50"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-slate-400">
                Remember my login credentials
              </label>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-physics-purple to-physics-blue hover:brightness-110 text-white text-sm font-bold tracking-wide transition-all shadow-lg shadow-physics-purple/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-dark-border/30"></span>
            <span className="relative px-3 bg-[#0d0a21] text-xs font-semibold uppercase tracking-wider text-slate-500">
              Or continue with
            </span>
          </div>

          <button
            onClick={() => alert("Google SSO Integration is not configured yet")}
            disabled={formLoading}
            className="w-full py-3 px-4 rounded-xl glassmorphism border border-dark-border/50 hover:bg-white/5 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.53 5.53 0 018.4 13a5.53 5.53 0 015.59-5.514c1.472 0 2.808.57 3.805 1.493l3.078-3.078C18.91 3.992 16.63 3 13.99 3A9.99 9.99 0 004 13a9.99 9.99 0 009.99 10c5.44 0 9.59-3.824 9.59-9.59 0-.585-.052-1.154-.15-1.705l-11.19-.42z"
              />
            </svg>
            Google Identity
          </button>
        </div>

        <p className="text-center text-xs sm:text-sm text-slate-500 mt-6">
          New to Physicsrishi?{" "}
          <Link href="/signup" className="font-semibold text-physics-purple hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
