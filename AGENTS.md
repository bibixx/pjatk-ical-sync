# PJATK iCal Sync

Proxy that scrapes PJATK's schedule page and serves a fixed iCal feed. Built with TypeScript, esbuild, Fastify.

## Commands
- `yarn build` — bundle to `dist/bundle.js`
- `yarn start` — run the bundle
- `yarn dev` — watch mode with auto-restart
- `yarn type-check` — TypeScript checking (no emit)

## Project structure
- `src/index.ts` — entry point, wires up the server and scraping
- `src/utils/scrape/` — login + calendar export from planzajec.pjwstk.edu.pl
  - `login.ts` — authenticates with PJATK (GET tokens → POST credentials → follow redirect → collect cookies)
  - `getCal.ts` — fetches the iCal export (GET tokens → POST with date range)
  - `parseViewStateTokens.ts` — shared helper to extract VIEWSTATE tokens from HTML
- `src/utils/regenerateICal/` — parses the exported .ics and fixes issues
  - `regenerateICal.ts` — main pipeline: parse → fix → regenerate
  - `generateEvent.ts` — builds corrected iCal events
  - `getDates.ts` / `getDayOffset.ts` — handles timezone/DST offset issues
  - `parseSummary.ts` / `parseExamSummary.ts` — extracts structured data from event summaries
  - `getDescription.ts` — generates event descriptions
- `src/utils/fastify.ts` — HTTP server, serves the calendar endpoint
- `src/utils/env.ts` — environment variable loading (USERNAME, PASSWORD, CALENDAR_PASSWORD)
- `src/utils/getArgs.ts` — query parameter parsing (from, to, password)

## Scraping flow
1. `login()` — GET `Logowanie.aspx` to fetch VIEWSTATE tokens and session cookies → POST credentials → follow 302 redirect → collect auth cookies
2. `getCal()` — GET `TwojPlan.aspx` to fetch fresh VIEWSTATE tokens → POST with date range → receive .ics file
3. `regenerateICal()` — parse the .ics, fix format issues (spec compliance, DST offset bugs), rebuild as valid iCal

## Key context
- The PJATK site uses **ASP.NET WebForms** — every POST requires `__VIEWSTATE`, `__EVENTVALIDATION`, and optionally `__VIEWSTATEGENERATOR` tokens parsed from a preceding GET. These tokens rotate on server redeploys, so they must **never** be hardcoded.
- Cookie handling uses `cookiejar` — always pass **full** Set-Cookie strings (with attributes like Path, Domain). The library handles parsing internally. Do not strip attributes with `.split(';')`.
- All HTTP requests in a scraping session should use a **consistent User-Agent** header — including the initial GET requests. Inconsistency can trigger anti-scraping measures.
- The exported .ics from PJATK doesn't fully conform to the iCal spec — that's why `regenerateICal` exists. Events also have wrong offsets on DST changeover days.
- The project targets **Node 16** (see esbuild config). Keep this in mind when using newer APIs.

## Deployment
- Dockerized via `Dockerfile` + `docker-compose.local.yml`
- Also deployable to Google Cloud Run (see README)
- Requires `.env` with `USERNAME`, `PASSWORD`, and optionally `CALENDAR_PASSWORD`
