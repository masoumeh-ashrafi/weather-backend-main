# Weather App Backend

A small Express proxy that fetches weather data from OpenWeatherMap so the
API key stays on the server and is never exposed to the frontend/browser.

## Structure

```
backend/
├── src/
│   ├── config/index.js          # loads & validates env vars
│   ├── routes/weatherRoutes.js  # /api/weather routes
│   ├── controllers/weatherController.js
│   ├── services/weatherService.js  # actual OpenWeatherMap call
│   ├── middleware/errorHandler.js  # 404 + centralized error handler
│   ├── utils/AppError.js        # custom operational error class
│   ├── app.js                   # express app (middleware, routes)
│   └── server.js                # entry point, starts the server
├── .env.example
└── package.json
```

## Setup

1. Copy the example env file and add your real key:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set `OPENWEATHER_API_KEY=<your key>`.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development (auto-restarts on file changes, Node's built-in `--watch`):
   ```bash
   npm run dev
   ```

   Or in production:
   ```bash
   npm start
   ```

## API

### `GET /api/weather?city=Kathmandu`

Response:
```json
{
  "success": true,
  "data": {
    "coord": { "lon": 85.3167, "lat": 27.7167 },
    "weather": [{ "id": 804, "main": "Clouds", "description": "overcast clouds", "icon": "04d" }],
    "main": { "temp": 25.27, "feels_like": 25.86, "humidity": 77 },
    "name": "Kathmandu",
    "...": "..."
  }
}
```

On error (missing city, city not found, bad key, provider down, etc.):
```json
{
  "success": false,
  "message": "city not found"
}
```

### `GET /health`
Simple health check → `{ "status": "ok" }`.

## Access control

`/api/weather` is protected by two middleware, in this order:

1. **`originGuard`** — rejects any request whose `Origin`/`Referer` header
   doesn't match `CLIENT_ORIGIN` from `.env`. This blocks direct browser
   visits, plain `curl` (no headers), and most bots/scanners. **It is not
   real authentication** — a determined caller can set these headers by hand
   with curl. For genuine access control you'd need API keys per client or
   user login, which only makes sense once there's a real account/session
   system issuing those credentials.
2. **`weatherRateLimiter`** — caps each IP at 60 requests/minute regardless
   of origin, so scripted abuse hits a wall even if it works around #1.

To test the origin guard yourself:
```bash
# blocked — no Origin header
curl "http://localhost:5000/api/weather?city=Kathmandu"

# blocked — wrong Origin
curl -H "Origin: http://evil.com" "http://localhost:5000/api/weather?city=Kathmandu"

# allowed — matches CLIENT_ORIGIN in .env
curl -H "Origin: http://localhost:5173" "http://localhost:5000/api/weather?city=Kathmandu"
```

Make sure `CLIENT_ORIGIN` in `.env` matches your frontend's actual dev port
(Vite defaults to `5173`, not `3000`) and your deployed frontend's real
domain in production.

## Notes

- No deprecated packages are used. `fetch` is Node's built-in global (Node 18+),
  so there's no dependency on `node-fetch` or the deprecated `request` package.
- `helmet` sets sensible security headers, `cors` restricts allowed origins via
  `CLIENT_ORIGIN` in `.env`, `express-rate-limit` throttles per-IP request
  volume, and `morgan` logs requests.
- The API key only ever lives in `.env` on the server and in `process.env`;
  it's never sent to or readable by the client.
