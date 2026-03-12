"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [user, setUser] = useState(null);

  const fetchEvents = async (filterParam = activeFilter) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events?filter=${filterParam}`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    fetchEvents(filter);
  };

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data, error } = await supabase
        .from('saved_events')
        .select('event_id')
        .eq('user_id', user.id);
      
      if (!error && data) {
        setSavedEventIds(data.map(item => item.event_id));
      }
    } else {
      const saved = JSON.parse(localStorage.getItem("savedEvents") || "[]");
      setSavedEventIds(saved.map(e => e.id));
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchUserData();
  }, []);
  
  const toggleSave = async (event) => {
    if (user) {
      if (savedEventIds.includes(event.id)) {
        const { error } = await supabase
          .from('saved_events')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', event.id);
        
        if (!error) {
          setSavedEventIds(prev => prev.filter(id => id !== event.id));
        }
      } else {
        const { error } = await supabase
          .from('saved_events')
          .insert({ user_id: user.id, event_id: event.id });
        
        if (!error) {
          setSavedEventIds(prev => [...prev, event.id]);
        }
      }
    } else {
      let saved = JSON.parse(localStorage.getItem("savedEvents") || "[]");
      if (savedEventIds.includes(event.id)) {
        saved = saved.filter(e => e.id !== event.id);
      } else {
        saved.push(event);
      }
      localStorage.setItem("savedEvents", JSON.stringify(saved));
      setSavedEventIds(saved.map(e => e.id));
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-24 max-w-7xl mx-auto w-full">
        {/* Search Bar */}
        <div className="px-4 py-4">
          <label className="relative flex items-center w-full group">
            <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-primary transition-colors">
              search
            </span>
            <input 
              className="w-full h-12 pl-12 pr-4 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-500 outline-none" 
              placeholder="Search events in Toronto" 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-3 px-4 pb-6 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => handleFilterClick("all")}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Events
          </button>
          <button 
            onClick={() => handleFilterClick("weekend")}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === "weekend" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            This Weekend
          </button>
          <button 
            onClick={() => handleFilterClick("month")}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === "month" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            This Month
          </button>
        </div>

        <div className="px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isLoading ? "Syncing..." : `Showing ${filteredEvents.length} events`}
            </h2>
            <button 
              onClick={() => fetchEvents()}
              className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
              disabled={isLoading}
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh
            </button>
          </div>
          
          {/* Event List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
               [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
               ))
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onToggleSave={toggleSave}
                  isSaved={savedEventIds.includes(event.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">event_busy</span>
                <p className="text-slate-500">No events found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}


