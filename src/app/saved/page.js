"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

export default function SavedPage() {
  const [savedEvents, setSavedEvents] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('saved_events')
          .select(`
            event_id,
            events (*)
          `)
          .eq('user_id', user.id);
        
        if (!error && data) {
          const events = data.map(item => ({
            id: item.events.id,
            title: item.events.title,
            location: item.events.location,
            date: item.events.date,
            price: item.events.price,
            category: item.events.category,
            imageUrl: item.events.image_url,
            description: item.events.description,
            sourceUrl: item.events.source_url
          }));
          setSavedEvents(events);
          setSavedEventIds(events.map(e => e.id));
        }
      } else {
        // Fetch from LocalStorage
        const saved = JSON.parse(localStorage.getItem("savedEvents") || "[]");
        setSavedEvents(saved);
        setSavedEventIds(saved.map(e => e.id));
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const toggleSave = async (event) => {
    if (user) {
      // Remove from Supabase
      const { error } = await supabase
        .from('saved_events')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', event.id);
      
      if (!error) {
        setSavedEvents(prev => prev.filter(e => e.id !== event.id));
        setSavedEventIds(prev => prev.filter(id => id !== event.id));
      }
    } else {
      // Remove from LocalStorage
      let saved = JSON.parse(localStorage.getItem("savedEvents") || "[]");
      saved = saved.filter(e => e.id !== event.id);
      localStorage.setItem("savedEvents", JSON.stringify(saved));
      setSavedEvents(saved);
      setSavedEventIds(saved.map(e => e.id));
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-24 max-w-7xl mx-auto w-full">
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Saved Events ({savedEvents.length})
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : savedEvents.length > 0 ? (
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
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
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

