import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Physicsrishi | Master JEE Main & NEET Physics",
  description: "Master JEE Main and NEET physics through highly structured learning, interactive visualizations, and targeted practice curated by expert mentors.",
  keywords: ["JEE Main", "NEET", "Physics", "Physicsrishi", "Structured Learning", "JEE Physics", "NEET Physics"],
  authors: [{ name: "Physicsrishi Team" }],
  openGraph: {
    title: "Physicsrishi | Master JEE Main & NEET Physics",
    description: "Unlock structured courses, high-quality content, and interactive learning designed to boost your physics percentile in JEE and NEET.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Physicsrishi | Master JEE Main & NEET Physics",
    description: "Structured, interactive physics courses for JEE and NEET.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans antialiased text-slate-200 bg-dark-bg selection:bg-physics-purple/30 selection:text-physics-purple-300">
        <AuthProvider>
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
        
        <footer className="border-t border-dark-border bg-dark-bg/80 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-physics-purple to-physics-blue">
                Physicsrishi
              </span>
            </div>
            <p>&copy; {new Date().getFullYear()} Physicsrishi. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-350 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-350 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-350 transition-colors">Support</a>
            </div>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
