"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-24 max-w-lg mx-auto w-full px-4 py-8">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-slate-400">lock</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Sign in to your profile</h2>
            <p className="text-slate-500 mb-8 max-w-xs">Access your saved events and personalized recommendations across all your devices.</p>
            <Link 
              href="/login" 
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Log In
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary/20 relative group">
                <span className="material-symbols-outlined text-5xl text-primary">person</span>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user.email.split('@')[0]}</h2>
              <p className="text-slate-500">{user.email}</p>
            </div>

            <div className="space-y-4">
              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <h3 className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50">
                  Account Settings
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <button className="w-full px-4 py-4 flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">notifications</span>
                      <span>Notification Preferences</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                  </button>
                  <button className="w-full px-4 py-4 flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">palette</span>
                      <span>Appearance (Dark Mode)</span>
                    </div>
                    <div className="w-10 h-6 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                    </div>
                  </button>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                 <h3 className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50">
                  Support
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <button className="w-full px-4 py-4 flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">help</span>
                      <span>Help Center</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-4 flex items-center justify-between text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined">logout</span>
                      <span className="font-semibold">Log Out</span>
                    </div>
                  </button>
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

