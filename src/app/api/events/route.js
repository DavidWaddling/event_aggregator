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

      // Analyze page structure and get events
      // Assuming articles or divs with specific classes contain events
      $(".listing-item").each((i, el) => {
        const title = $(el).find(".listing-item-title, h3").text().trim();
        const date = $(el).find(".listing-item-date").text().trim() || "TBD";
        const location = $(el).find(".listing-item-location").text().trim() || "Toronto";
        const url = $(el).find("a").attr("href") || "";

        if (title) {
          events.push({
            id: `dt-${i}`,
            title,
            location,
            date,
            price: "Check website",
            category: "Toronto Event",
            imageIcon: "🍁",
            sourceUrl: url.startsWith("http") ? url : `https://www.destinationtoronto.com${url}`
          });
        }
      });
    }
  } catch (error) {
    console.error("Error scraping Destination Toronto:", error);
  }

  // Scrape Eventbrite (Note: Eventbrite data is heavily JS driven, so server scraping pure HTML may miss data, but we can try metadata or server-rendered parts)
  try {
    const eventbriteResponse = await fetch("https://www.eventbrite.ca/d/canada--toronto/events--this-weekend/");
    if (eventbriteResponse.ok) {
      const ebHtml = await eventbriteResponse.text();
      const $ = cheerio.load(ebHtml);

      // Basic extraction attempt
      $(".discover-search-desktop-card").each((i, el) => {
        const title = $(el).find("h3").text().trim();
        const location = $(el).find(".event-card__subtitle").last().text().trim() || "Toronto, ON";
        const date = $(el).find(".event-card__subtitle").first().text().trim() || "This Weekend";
        const price = $(el).find(".event-card__price").text().trim() || "Check website";
        const url = $(el).find("a").attr("href") || "";

        if (title) {
          events.push({
            id: `eb-${i}`,
            title,
            location,
            date,
            price,
            category: "Eventbrite",
            imageIcon: "🎟️",
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
