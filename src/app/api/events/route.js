import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  
  const events = [];

  // Scrape Destination Toronto (only on "all" or if we want fresh data)
  // To keep it fast, we could only scrape on 'refresh=true' or 'all'
  try {
    const torontoResponse = await fetch("https://www.destinationtoronto.com/events/", { cache: 'no-store' });
    if (torontoResponse.ok) {
      const torontoHtml = await torontoResponse.text();
      const $ = cheerio.load(torontoHtml);

      $(".listing-item, .card, .event-card").each((i, el) => {
        const title = $(el).find(".listing-item-title, h3, .title").text().trim();
        const date = $(el).find(".listing-item-date, .date, time").text().trim() || "TBD";
        const location = $(el).find(".listing-item-location, .location, .venue").text().trim() || "Toronto";
        const url = $(el).find("a").first().attr("href") || "";
        const imageUrl = $(el).find("img").attr("src") || "";
        const description = $(el).find(".description, .summary, p").first().text().trim();
        
        const textContent = $(el).text().toLowerCase();
        const isSoldOut = textContent.includes("sold out") || textContent.includes("cancelled");

        if (title && !isSoldOut) {
          events.push({
            id: `dt-${title.toLowerCase().substring(0, 15).replace(/[^a-z0-9]/g, "")}`,
            title,
            location,
            date,
            price: "Check website",
            category: "Toronto Event",
            imageUrl: imageUrl.startsWith("http") ? imageUrl : (imageUrl ? `https://www.destinationtoronto.com${imageUrl}` : ""),
            description: description || "Join us for this exciting Toronto event!",
            sourceUrl: url.startsWith("http") ? url : `https://www.destinationtoronto.com${url}`
          });
        }
      });
    }
  } catch (error) {
    console.error("Error scraping Destination Toronto:", error);
  }

  // Scrape Eventbrite
  try {
    const eventbriteResponse = await fetch("https://www.eventbrite.ca/d/canada--toronto/events--this-weekend/", { cache: 'no-store' });
    if (eventbriteResponse.ok) {
      const ebHtml = await eventbriteResponse.text();
      const $ = cheerio.load(ebHtml);

      $(".discover-search-desktop-card, .event-card").each((i, el) => {
        const title = $(el).find("h3").text().trim();
        const locationText = $(el).find(".event-card__subtitle").last().text().trim() || "Toronto, ON";
        const date = $(el).find(".event-card__subtitle").first().text().trim() || "This Weekend";
        const price = $(el).find(".event-card__price").text().trim() || "Check website";
        const url = $(el).find("a").attr("href") || "";
        const imageUrl = $(el).find("img").attr("src") || "";
        
        const textContent = $(el).text().toLowerCase();
        const isSoldOut = textContent.includes("sold out") || textContent.includes("waitlist");

        if (title && !isSoldOut) {
          events.push({
            id: `eb-${title.toLowerCase().substring(0, 15).replace(/[^a-z0-9]/g, "")}`,
            title,
            location: locationText,
            date,
            price,
            category: "Eventbrite",
            imageUrl: imageUrl,
            description: "Explore this upcoming Eventbrite experience in Toronto.",
            sourceUrl: url
          });
        }
      });
    }
  } catch (error) {
    console.error("Error scraping Eventbrite:", error);
  }

  // Deduplication
  const uniqueEvents = Array.from(new Map(events.map(item => [item.title.toLowerCase(), item])).values());

  // Upsert to Supabase
  if (uniqueEvents.length > 0) {
    const dbEvents = uniqueEvents.map(e => ({
      id: e.id,
      title: e.title,
      location: e.location,
      date: e.date,
      price: e.price,
      category: e.category,
      image_url: e.imageUrl,
      description: e.description,
      source_url: e.sourceUrl
    }));

    await supabase.from('events').upsert(dbEvents, { onConflict: 'id' });
  }

  // Build Query with Filters
  let query = supabase.from('events').select('*');

  if (filter === "weekend") {
    // Basic text-based filter for "Weekend" or Sat/Sun in the date string
    // In a real app we'd use proper date columns, but this works for scraped strings
    query = query.or('date.ilike.%sat%,date.ilike.%sun%,date.ilike.%weekend%');
  } else if (filter === "month") {
    // Current month filter (e.g. March)
    const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date());
    query = query.ilike('date', `%${currentMonth}%`);
  }

  const { data: allEvents, error: fetchError } = await query.order('created_at', { ascending: false });

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const formattedEvents = allEvents.map(e => ({
    id: e.id,
    title: e.title,
    location: e.location,
    date: e.date,
    price: e.price,
    category: e.category,
    imageUrl: e.image_url,
    description: e.description,
    sourceUrl: e.source_url
  }));

  return NextResponse.json({ events: formattedEvents });
}


