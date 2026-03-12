"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to find the event in the list or localStorage
    const fetchEvent = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        const found = data.events.find(e => e.id === id);
        if (found) {
            setEvent(found);
        } else {
            // Check saved events
            const saved = JSON.parse(localStorage.getItem("savedEvents") || "[]");
            const foundSaved = saved.find(e => e.id === id);
            setEvent(foundSaved);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  if (!event) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Event not found.</div>;

  return (
    <div className="relative mx-auto max-w-md min-h-screen dark:bg-slate-900 shadow-xl overflow-x-hidden pb-24 bg-slate-900 font-sans text-white">
      {/* Header Image & Close Button */}
      <div className="relative h-80 w-full overflow-hidden">
        {event.imageUrl ? (
          <img src={event.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt={event.title} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-slate-800 flex items-center justify-center text-8xl">
            {event.imageIcon || "🎟️"}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center size-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 bg-slate-800">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold leading-tight text-white">{event.title}</h1>
            <button className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>

          {/* Info Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">calendar_today</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">{event.date || "Date TBD"}</p>
                <p className="text-xs text-slate-400">Toronto, ON</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="size-10 flex items-center justify-center rounded-lg bg-emerald-900/30 text-emerald-400">
                <span className="material-symbols-outlined">confirmation_number</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">{event.price || "Check website"}</p>
                <p className="text-xs text-slate-400">Available at source</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">{event.location}</p>
                <p className="text-xs text-slate-400">Toronto, Canada</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-white mb-3">About the Event</h3>
          <p className="text-slate-400 leading-relaxed">
            {event.description || `Discover ${event.title} happening in Toronto at ${event.location}. This event is curated from our live local sources.`}
          </p>
        </div>

        {/* Location/Map Section */}
        <div className="mt-8 mb-6">
          <h3 className="text-lg font-bold text-white mb-3">Location</h3>
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
             <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                <div className="bg-primary p-2 rounded-full text-white shadow-lg animate-bounce">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
              </div>
          </div>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location + ", Toronto")}`}
            target="_blank"
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">map</span>
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800 z-50">
        <div className="max-w-md mx-auto">
          <a 
            href={event.sourceUrl}
            target="_blank"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
}
