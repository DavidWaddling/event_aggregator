"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import BottomNav from "@/components/BottomNav";

export default function SavedPage() {
  const [savedEvents, setSavedEvents] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedEvents") || "[]");
    setSavedEvents(saved);
    setSavedEventIds(saved.map(e => e.id));
  }, []);

  const toggleSave = (event) => {
    let saved = JSON.parse(localStorage.getItem("savedEvents") || "[]");
    if (savedEventIds.includes(event.id)) {
      saved = saved.filter(e => e.id !== event.id);
    } else {
      saved.push(event);
    }
    localStorage.setItem("savedEvents", JSON.stringify(saved));
    setSavedEvents(saved);
    setSavedEventIds(saved.map(e => e.id));
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-24 max-w-7xl mx-auto w-full">
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Saved Events ({savedEvents.length})
          </h2>
          
          {savedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onToggleSave={toggleSave}
                  isSaved={true}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">favorite_border</span>
              <p className="text-slate-500">You haven't saved any events yet.</p>
              <a href="/" className="mt-4 inline-block text-primary font-semibold hover:underline">
                Explore events
              </a>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
