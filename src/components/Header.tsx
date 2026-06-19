"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "JEE Prep", href: "/jee" },
    { name: "NEET Prep", href: "/neet" },
    { name: "Free Demo", href: "/demo" },
  ];

  if (user) {
    navLinks.push({ name: "Dashboard", href: "/dashboard" });
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-dark-border/40 bg-dark-bg/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 rounded-full border-2 border-physics-purple flex items-center justify-center overflow-visible">
                <div className="w-2 h-2 rounded-full bg-physics-blue animate-pulse-slow"></div>
                {/* Orbit paths */}
                <div className="absolute inset-0 rounded-full border border-physics-blue/40 border-dashed animate-spin [animation-duration:10s]"></div>
                <div className="absolute inset-0 rounded-full border border-physics-indigo/35 animate-spin [animation-duration:6s] rotate-45"></div>
              </div>
              <span className="font-display font-black text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-physics-purple group-hover:to-physics-blue transition-all duration-300">
                Physicsrishi
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-physics-purple/10 text-physics-purple border border-physics-purple/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm font-semibold text-slate-350 bg-white/5 px-4 py-2 rounded-full border border-dark-border/20">
                  Hey, <span className="text-white font-bold">{user.name.split(" ")[0]}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-dark-border/30 transition-all duration-200"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-semibold text-slate-350 hover:text-white transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="relative group px-5 py-2 rounded-full text-sm font-semibold overflow-hidden transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-physics-purple to-physics-blue transition-transform duration-300 group-hover:scale-105"></span>
                  <span className="relative text-white">Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slider */}
      <div
        className={`md:hidden absolute top-20 left-0 right-0 glassmorphism border-b border-dark-border/40 bg-dark-bg/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                isActive(link.href)
                  ? "bg-physics-purple/10 text-physics-purple border-l-4 border-physics-purple"
                  : "text-slate-350 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-dark-border/30 flex flex-col gap-3">
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-slate-400 font-semibold">
                  Signed in as: <span className="text-white">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-3 bg-white/5 border border-dark-border/40 rounded-lg text-white font-semibold transition-all hover:bg-white/10"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 text-slate-350 font-semibold hover:text-white transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 bg-gradient-to-r from-physics-purple to-physics-blue rounded-lg text-white font-semibold transition-all hover:brightness-110"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
