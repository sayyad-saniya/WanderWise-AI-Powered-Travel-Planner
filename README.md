# WanderWise — AI-Powered Travel Planner

Full-stack app that turns a destination and a few preferences into a day-by-day
itinerary, a destination weather forecast, and a budget estimate — with a
drag-and-drop planner and a shareable link for every trip.

**Stack:** React (Vite) · Spring Boot 3 · MongoDB · OpenAI API · OpenWeatherMap API

## How it works

1. `POST /api/trips` — takes destination/dates/travelers/budget level/preferences,
   asks OpenAI for a day-by-day itinerary and a budget estimate, geocodes the
   destination and pulls a forecast from OpenWeatherMap, then saves everything
   in MongoDB behind a short random **share token**.
2. `GET /api/trips/{token}` — loads a trip by its share token (this is what the
   `/trip/:token` share link resolves to).
3. `PUT /api/trips/{token}/days` — persists the itinerary after the drag-and-drop
   planner reorders or moves activities between days.
4. If no `OPENAI_API_KEY` is set (or the call fails), the backend falls back to a
   template itinerary and a heuristic budget so the app still works end to end.
   If no `OPENWEATHER_API_KEY` is set, the weather strip just shows an empty state.

## Project layout

```
wanderwise/
├── backend/     Spring Boot API (Java 17, Maven)
├── frontend/    React + Vite app
└── docker-compose.yml   Optional local MongoDB
```

## Prerequisites

- Java 17+ and Maven
- Node.js 18+
- A MongoDB instance (local, Docker, or Atlas)
- An OpenAI API key (optional but recommended)
- An OpenWeatherMap API key (optional — free tier is enough)

All commands below are **PowerShell**, for a Windows setup.

## 1. Start MongoDB (optional, via Docker)

```powershell
cd wanderwise
docker compose up -d
```

Or point `MONGODB_URI` at an existing MongoDB / Atlas cluster instead.

## 2. Run the backend

```powershell
cd wanderwise\backend
Copy-Item .env.example .env
notepad .env   # fill in OPENAI_API_KEY / OPENWEATHER_API_KEY / MONGODB_URI

# Load the .env values into the current PowerShell session
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim())
    }
}

mvn spring-boot:run
```

The API starts on `http://localhost:8080`. Check it with:

```powershell
Invoke-RestMethod http://localhost:8080/api/trips/health
```

## 3. Run the frontend

```powershell
cd wanderwise\frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Building for production

```powershell
cd wanderwise\backend
mvn clean package
java -jar target\wanderwise-backend.jar
```

```powershell
cd wanderwise\frontend
npm run build
```

`npm run build` outputs static files to `frontend\dist` — serve them with any
static host (Nginx, Vercel, Netlify, etc.) and point `VITE_API_BASE_URL` at
your deployed backend.

## Notes

- Share tokens are 9-character random strings (`TokenGenerator`), so trip URLs
  look like `http://localhost:5173/trip/aZ3kLm2Qf`.
- The drag-and-drop planner (`@dnd-kit`) supports moving activities within a
  day or across days; every change is autosaved to the backend half a second
  after you stop dragging.
- Budget totals are for the whole trip and all travelers combined, in USD.
