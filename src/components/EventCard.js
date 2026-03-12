"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function EventCard({ event, onToggleSave, isSaved }) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-transform active:scale-[0.98]">
      <div className="relative h-56 w-full">
        {/* We'll use the placeholder logic from the previous design if image icon is used, or the img tag from Stitch */}
        {event.imageUrl ? (
          <img 
            alt={event.title} 
            className="w-full h-full object-cover" 
            src={event.imageUrl} 
          />
        ) : (
          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl">
            {event.imageIcon || "🎟️"}
          </div>
        )}
        
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-lg shadow-sm">
          <p className="text-xs font-bold text-primary">{event.date || "TBD"}</p>
        </div>
        
        <button 
          className={`absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full transition-colors ${isSaved ? 'text-red-500' : 'text-white hover:bg-white/40'}`}
          onClick={() => onToggleSave(event)}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${isSaved ? 1 : 0}` }}>
            favorite
          </span>
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
          {event.title}
        </h3>
        <div className="mt-2 space-y-2">
          <div className="flex items-center text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-sm mr-1">location_on</span>
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-sm mr-1">payments</span>
            <span className="text-sm">Cost: {event.price || "Check website"}</span>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
           <Link 
            href={`/events/${event.id}`} 
            className="flex-1 text-center py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
           >
             View Details
           </Link>
        </div>
      </div>
    </div>
  );
}
