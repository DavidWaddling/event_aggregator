"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      router.push("/");
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Check your email for the confirmation link!" });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-4xl">travel_explore</span>
              EventAggregator
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to sync your saved events</p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                message.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                <span className="material-symbols-outlined text-sm">login</span>
              </button>
              
              <button
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full h-12 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
             <p className="text-slate-500 text-sm italic">
                Tip: You can use dummy credentials or create a real account.
             </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
            <Link href="/" className="text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1 font-medium">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Explore
            </Link>
        </div>
      </div>
    </div>
  );
}
