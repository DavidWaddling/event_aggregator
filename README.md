# Event Aggregator 🍁

A modern, centralized dashboard for discovering events in Toronto. This application aggregates live data from multiple sources, deduplicates results, and provides a sleek, glassmorphic interface for browsing what's happening.

## 🚀 Features

- **Multi-Source Scraping**: Pulls live data from Destination Toronto and Eventbrite.
- **Smart Deduplication**: Automatically filters out duplicate listings across sources.
- **Premium UI**: Built with a glassmorphism design language, featuring smooth micro-animations and a dark-mode first aesthetic.
- **Real-time Sync**: Manual sync button to refresh sources on demand.
- **Responsive Design**: Optimized for both desktop and mobile viewing.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Styling**: Vanilla CSS with Modern Web Design patterns
- **Scraping**: [Cheerio](https://cheerio.js.org/)
- **State Management**: React Hooks (useState, useEffect)

## 🏁 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app/page.js`: The main dashboard UI.
- `src/app/api/events/route.js`: The background engine that scrapes and processes event data.
- `src/app/globals.css`: The design system and styling tokens.

## 📝 License

This project is licensed under the MIT License.
