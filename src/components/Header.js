"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <button className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
           Event Aggregator
        </h1>
        <button className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
