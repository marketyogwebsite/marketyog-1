# MarketYog — Static Frontend

This repository contains a static frontend scaffold for MarketYog — a simple placement & hiring website for Sales and Customer Care agents built with **HTML, CSS and JavaScript** (no backend required).

Features
- Responsive static site with hero, "How it works", job listings, partner logos, and contact form
- Apply modal with resume upload and client-side validation
- Applications and contact messages are stored locally in the browser (localStorage)
- Admin buttons in the footer to export stored applications/messages as a JSON file or clear them from the browser

How to run locally
1. Start a simple static server in the repo root (Python example):
   python -m http.server 8000
2. Open http://localhost:8000 in your browser

Node static server (run on any port)

1. Install Node (if not installed). Then from the repo root run:

```bash
npm install
npm start
```

2. To run on a specific port (for example port 3000):

```bash
PORT=3000 npm start
```

3. Open the printed URL (e.g., http://localhost:3000) in your browser.

Notes
- This is intentionally a static site — applications are saved to the browser for demos or small-scale use. If you want persisted server-side storage and email notifications, I can add a simple Java (Spring Boot) API or a serverless endpoint.

Next steps (optional)
- Add server-side API to receive applications
- Add admin dashboard to review & change candidate status
- Add better localization & SEO

