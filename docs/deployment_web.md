# Free Online Website Hosting

Sentinel Room can publish the web/PWA dashboard online for free as a static site. The online site is only the dashboard UI. The real FastAPI backend, MQTT broker, ESP32/Arduino hardware, and SQLite database stay local/private by default.

Recommended free host: [Cloudflare Pages](https://pages.cloudflare.com/). Alternatives: [Vercel Hobby](https://vercel.com/docs/accounts/plans/hobby), [Netlify Free](https://www.netlify.com/pricing), and [GitHub Pages](https://docs.github.com/pages).

Do not require a paid domain, paid cloud backend, paid database, paid tunnel, paid UI kit, paid icon set, paid font, paid API, or paid hosting add-on. Paid upgrades are optional and not needed for this project.

## Build The Web App

There is no root npm workspace script in this repo. Build the web app from `apps\web`:

```powershell
cd E:\SentinelRoom\apps\web
npm install
npm run build
```

Build output:

```text
E:\SentinelRoom\apps\web\dist
```

The build also creates `dist\404.html` as a static-host fallback for React routes.

## Environment Variables

Default local desktop backend:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000/ws/status
```

Online frontend plus online free mock/demo backend:

```env
VITE_API_BASE_URL=https://your-free-backend-url
VITE_WS_BASE_URL=wss://your-free-backend-url/ws/status
```

Use this only with a backend running:

```env
SENTINEL_MODE=mock
SENTINEL_MOCK_MODE=true
SENTINEL_ENABLE_HARDWARE=false
SENTINEL_ENABLE_MQTT=false
SENTINEL_PUBLIC_DEMO=true
```

Phone on the same trusted Wi-Fi:

```env
VITE_API_BASE_URL=http://192.168.x.x:8000
VITE_WS_BASE_URL=ws://192.168.x.x:8000/ws/status
```

Use the LAN URL only while the browser device is on the same trusted Wi-Fi. If you use Tailscale or ZeroTier, set these values to the private VPN address. Use a Cloudflare Tunnel URL only if you intentionally configure it, secure it, and understand the risk.

For GitHub Pages project sites, also set:

```env
VITE_BASE_PATH=/SentryRoom/
```

Backend CORS must allow the deployed site origin. Add only the exact free hosting URL you use:

```env
SENTINEL_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,tauri://localhost,https://your-site.pages.dev
```

Restart the backend after editing `.env`.

For local phone testing through the Vite dev server, also add your PC web origin:

```env
SENTINEL_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,tauri://localhost,http://192.168.x.x:5173
```

Important browser note: many HTTPS static hosts block calls to plain `http://192.168.x.x` because of browser mixed-content/private-network rules. If that happens, point the deployed frontend at an HTTPS online mock/demo backend. For real controls, use the local LAN web app or a private VPN address. Do not expose the backend publicly.

Free backend deployment guide: `E:\SentinelRoom\docs\deployment_backend.md`.

## Cloudflare Pages Free Deployment

Cloudflare Pages is the main recommendation because its Pages free tier supports static sites with generous free limits.

1. Push this repo to GitHub.
2. In Cloudflare, open `Workers & Pages > Create application > Pages`.
3. Connect the GitHub repo.
4. Set project name: `sentinel-room`.
5. Set framework preset: `Vite`.
6. Set root directory:

```text
apps/web
```

7. Set build command:

```text
npm install && npm run build
```

8. Set build output directory:

```text
dist
```

9. Add environment variables:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000/ws/status
```

10. Deploy.
11. Copy the generated `https://*.pages.dev` URL.
12. Add that exact URL to backend `SENTINEL_CORS_ORIGINS` if you want the deployed site to talk to the local backend.

No paid domain is required. Use the free `pages.dev` URL.

## Vercel Free Deployment

Use Vercel Hobby/free personal deployment only. Do not require paid analytics, paid functions, paid storage, paid domains, or paid team features.

1. Push this repo to GitHub.
2. In Vercel, choose `Add New > Project`.
3. Import the repo.
4. Set framework preset: `Vite`.
5. Set root directory:

```text
apps/web
```

6. Set build command:

```text
npm install && npm run build
```

7. Set output directory:

```text
dist
```

8. Add `VITE_API_BASE_URL` and `VITE_WS_BASE_URL`.
9. Deploy to the free `vercel.app` URL.
10. Add that exact URL to backend `SENTINEL_CORS_ORIGINS` only if real backend access is needed.

This repo also includes a root `vercel.json` so a direct Vercel deployment can build the static web app from `apps/web`.

## Netlify Free Deployment

Use Netlify Free only. Do not require paid forms, paid identity, paid databases, paid functions, paid bandwidth upgrades, or a paid domain.

1. Push this repo to GitHub.
2. In Netlify, choose `Add new site > Import an existing project`.
3. Connect the repo.
4. Set base directory:

```text
apps/web
```

5. Set build command:

```text
npm install && npm run build
```

6. Set publish directory:

```text
apps/web/dist
```

7. Add `VITE_API_BASE_URL` and `VITE_WS_BASE_URL`.
8. Deploy to the free `netlify.app` URL.
9. Add that exact URL to backend `SENTINEL_CORS_ORIGINS` only if real backend access is needed.

## GitHub Pages Free Fallback

GitHub Pages can host the static dashboard for free. It is the simplest fallback, but React routing can be less flexible than Cloudflare Pages/Vercel/Netlify. This repo creates `404.html` during build to help route refreshes.

Use GitHub Actions with:

```powershell
cd E:\SentinelRoom\apps\web
$env:VITE_BASE_PATH="/SentryRoom/"
npm install
npm run build
```

Publish:

```text
apps/web/dist
```

Environment variables should be configured in the workflow. Use:

```env
VITE_BASE_PATH=/SentryRoom/
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000/ws/status
```

For GitHub Pages plus free online mock backend, set the workflow values to:

```env
VITE_BASE_PATH=/SentryRoom/
VITE_API_BASE_URL=https://your-free-backend-url
VITE_WS_BASE_URL=wss://your-free-backend-url/ws/status
```

If the site is deployed at a custom GitHub Pages path, update `VITE_BASE_PATH` to match that path. A paid custom domain is not needed.

## Use The Website On A Phone

Same Wi-Fi local control is the safest default:

1. Keep the backend on the Windows PC.
2. Set backend `.env`:

```env
SENTINEL_ALLOW_LAN=true
SENTINEL_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,tauri://localhost,http://192.168.x.x:5173
```

3. Start the backend on the LAN only when you trust the Wi-Fi:

```powershell
cd E:\SentinelRoom
.\.venv\Scripts\Activate.ps1
python -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

4. Find the PC LAN IP from:

```text
http://127.0.0.1:8000/api/network/info
```

5. On the phone, open:

```text
http://192.168.x.x:5173/mobile
```

For a deployed frontend, open the free hosted URL on the phone. Real controls work only if the phone browser can reach the local/private backend URL configured in `VITE_API_BASE_URL`.

## What Works Online Without The Backend

If the backend is unreachable, the web app stays open in mock/demo UI mode and shows:

```text
Demo Mode - No hardware connected
```

Works without the backend:

- Dashboard layout and navigation.
- Camera/mannequin status display placeholders.
- Browser-saved camera source list and preview URLs.
- Sentry and calibration UI preview.
- Events page empty/offline state.
- Settings page for changing backend URL.
- PWA install/open behavior, depending on browser support.

Real hardware buttons are disabled while disconnected. Stop All stays visible, but shows `Backend unavailable` if it cannot send.

## What Works With Online Mock Backend

When the deployed frontend points at a free online mock/demo backend:

- PIN login.
- Mock arm/disarm.
- Mock lock/unlock.
- Mock sentry modes.
- Mock calibration save.
- Mock event logs.
- Mock demo mode.
- Mock Stop All.
- WebSocket status.
- Clear `Online Demo Mode - No hardware connected` style state from the backend.

The online backend does not control ESP32/Arduino hardware and does not publish real MQTT commands.

## What Requires Local Backend And Hardware

These require the local backend to be reachable:

- PIN/login.
- Arm/disarm.
- Stop All command delivery.
- Sentry mode changes.
- Manual servo movement and calibration save.
- Demo sequence command.
- Door, PIR, IR beam, ultrasonic, RGB, buzzer, and pseudo-laser LED status from the ESP32.
- Live WebSocket status.
- Event log updates from real actions.
- MQTT relay to ESP32/Arduino hardware.

## Keep Hardware Controls Private And Safe

Default architecture:

```text
Free static host -> dashboard UI only
Windows PC -> local FastAPI backend + SQLite + Mosquitto
ESP32/Arduino -> local Wi-Fi/MQTT/backend
```

Safety rules:

- Do not expose the backend to the public internet by default.
- Do not use public port forwarding.
- Do not expose your hardware-control backend directly to the public internet.
- Do not publish router ports for `8000`, `1883`, or the database.
- Do not host the hardware-control backend on a paid cloud server.
- Do not use a paid cloud database.
- Require PIN/login for all control actions.
- Keep Stop All visible in the UI.
- Use the normal red LED pseudo-laser only. Do not connect a real laser.
- Only add exact trusted frontend origins to `SENTINEL_CORS_ORIGINS`.

## Remote Access Outside Same Wi-Fi

Remote access is optional and should stay private-first.

Recommended free/private-first options:

- [Tailscale Personal](https://tailscale.com/pricing), if available for your use case.
- [ZeroTier Basic](https://docs.zerotier.com/pricing), if available for your use case.

Advanced only:

- [Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/) free option can expose an HTTPS URL, but this is risky for hardware controls. Use it only intentionally, secure it with access controls, keep PIN/login enabled, and never treat it as the default.

Never use public port forwarding for Sentinel Room hardware controls.
