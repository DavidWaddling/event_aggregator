"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Explore", icon: "explore", path: "/" },
    { label: "Saved", icon: "favorite", path: "/saved" },
    { label: "Profile", icon: "person", path: "/profile" },
    { label: "Log Out", icon: "logout", path: "/logout", color: "text-red-500" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg px-4 pb-6 pt-2 z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.label}
              href={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : item.color || 'text-slate-500 dark:text-slate-400 hover:text-primary'
              }`}
            >
              <span 
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && <div className="h-1 w-1 bg-primary rounded-full"></div>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
