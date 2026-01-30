# Platform Health – Daily Report Dashboard

A web dashboard for **Platform Health Check** weekly/daily reports with graphs and colorful metrics. Built for Engineering Managers, Tech Leads, and SREs.

## What’s included

- **Executive Snapshot** – Incidents, Performance, Frontend, Infrastructure, Cost, Test Quality (color-coded cards)
- **Charts** – API latency (P95), weekly cost, incidents by severity, 5xx error rate, alert volume, test pass rate
- **Key Improvements & Regressions** – Green/red lists with bullets
- **Major Incidents / Outages** – Table with date, severity, service, duration, impact
- **Incident Summary (WoW)** – MTTA, MTTR, P0/P1, unacknowledged/unresolved alerts
- **Top Recurring Alerts** – Rule, count, service, status
- **Cost Snapshot** – Total cost, WoW change, top driver
- **Top Risks** – Next-week risks
- **Team Footprint** – Backend services, workers, frontend apps, datastores, Pub/Sub
- **Recommended Focus Areas** – Numbered action list

## How to run

1. **Open in browser (no server):**  
   Double-click `index.html` or run:
   ```bash
   open index.html
   ```

2. **If you see "connection failed" or charts don’t load):**
   ```bash
   python3 -m http.server 8080
   ```
   Then open **http://localhost:8080** in your browser. Or use `npx serve .` and open the URL shown.

## Tech

- HTML5, CSS3 (custom properties, grid, flexbox)
- [Chart.js](https://www.chartjs.org/) (line, bar, doughnut) for graphs
- Vanilla JavaScript for chart setup
- Sample data from the Platform Health Check weekly report examples

## Customization

- **Data:** Edit `index.html` for tables and copy, and `app.js` for chart `data` arrays.
- **Colors:** Change CSS variables in `styles.css` (`:root`) and `chartColors` in `app.js`.
