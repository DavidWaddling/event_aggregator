import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET() {
  const events = [];

  // Scrape Destination Toronto
  try {
    const torontoResponse = await fetch("https://www.destinationtoronto.com/events/");
    if (torontoResponse.ok) {
      const torontoHtml = await torontoResponse.text();
      const $ = cheerio.load(torontoHtml);

      // Analyze page structure and get events (updated selectors)
      $(".listing-item, .card, .event-card").each((i, el) => {
        const title = $(el).find(".listing-item-title, h3, .title").text().trim();
        const date = $(el).find(".listing-item-date, .date, time").text().trim() || "TBD";
        const location = $(el).find(".listing-item-location, .location, .venue").text().trim() || "Toronto";
        const url = $(el).find("a").first().attr("href") || "";
        const imageUrl = $(el).find("img").attr("src") || "";
        const description = $(el).find(".description, .summary, p").first().text().trim();
        
        // Filtering Sold Out from text indicators
        const textContent = $(el).text().toLowerCase();
        const isSoldOut = textContent.includes("sold out") || textContent.includes("cancelled");

        if (title && !isSoldOut) {
          events.push({
            id: `dt-${i}-${title.substring(0, 5).toLowerCase().replace(/\s/g, "")}`,
            title,
            location,
            date,
            price: "Check website",
            category: "Toronto Event",
            imageUrl: imageUrl.startsWith("http") ? imageUrl : `https://www.destinationtoronto.com${imageUrl}`,
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
    const eventbriteResponse = await fetch("https://www.eventbrite.ca/d/canada--toronto/events--this-weekend/");
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
            id: `eb-${i}-${title.substring(0, 5).toLowerCase().replace(/\s/g, "")}`,
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

  // Deduplication based on title
  const uniqueEvents = Array.from(new Map(events.map(item => [item.title.toLowerCase(), item])).values());

  return NextResponse.json({ events: uniqueEvents });
}
