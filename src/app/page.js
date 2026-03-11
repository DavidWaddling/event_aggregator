"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <header className="header animate-fade-in">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          EventFinder
        </div>
        <button className="btn btn-primary" onClick={fetchEvents} disabled={isLoading}>
          {isLoading ? "Syncing..." : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Sync Sources
            </>
          )}
        </button>
      </header>

      <main className="dashboard-grid">
        {/* Left Sidebar / Filters */}
        <aside className="glass-panel animate-fade-in delay-1">
          <div className="filter-group">
            <label className="filter-label">Search Events</label>
            <input 
              type="text" 
              className="filter-input" 
              placeholder="e.g., Tech Summit..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Location</label>
            <select className="filter-input">
              <option value="">Anywhere</option>
              <option value="Toronto">Toronto</option>
            </select>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="events-grid animate-fade-in delay-2">
          {isLoading ? (
            <div className="glass-panel" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '4rem'}}>
              <h3 className="event-title">Scraping Websites...</h3>
              <p style={{color: 'var(--text-muted)'}}>Fetching live events from Destination Toronto and Eventbrite</p>
            </div>
          ) : (
            <>
              {filteredEvents.map((event) => (
                <div key={event.id || Math.random().toString()} className="glass-panel event-card">
                  <div className="event-image-placeholder">
                    {event.imageIcon || "🎟️"}
                  </div>
                  
                  <span className="badge" style={{marginBottom: '0.75rem', alignSelf: 'flex-start'}}>
                    {event.category || "Event"}
                  </span>
                  
                  <h3 className="event-title">{event.title}</h3>
                  
                  <div className="event-meta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {event.location || "Toronto"}
                  </div>
                  
                  <div className="event-meta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {event.date || "TBD"}
                  </div>

                  <div className="event-footer">
                    <div className="event-price">{event.price || "Check site"}</div>
                    <a className="btn" href={event.sourceUrl || "#"} target="_blank" rel="noopener noreferrer">View Source</a>
                  </div>
                </div>
              ))}
              
              {filteredEvents.length === 0 && (
                <div className="glass-panel" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '4rem'}}>
                  <h3 className="event-title">No events found</h3>
                  <p style={{color: 'var(--text-muted)'}}>Try adjusting your filters, or press "Sync Sources" if empty.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
