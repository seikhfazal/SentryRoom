# Sentinel Room Web/PWA

Responsive Vite + React dashboard and phone controller for Sentinel Room.

```powershell
cd E:\SentinelRoom\apps\web
npm install
npm run dev
npm run build
```

Open `/mobile` from a phone browser on the same trusted Wi-Fi network after LAN mode is enabled in the backend.

## Free Online Website Hosting

The web/PWA is a static Vite build and can be deployed for free while the backend and hardware remain local/private.

Recommended: Cloudflare Pages. Alternatives: Vercel Hobby/free personal, Netlify Free, and GitHub Pages fallback.

Build:

```powershell
cd E:\SentinelRoom\apps\web
npm install
npm run build
```

Cloudflare Pages:

- Root directory: `apps/web`
- Build command: `npm install && npm run build`
- Output directory: `dist`

Vercel:

- Root directory: `apps/web`
- Framework: `Vite`
- Build command: `npm install && npm run build`
- Output directory: `dist`

Netlify:

- Base directory: `apps/web`
- Build command: `npm install && npm run build`
- Publish directory: `apps/web/dist`

GitHub Pages fallback:

- Build with `VITE_BASE_PATH=/SentryRoom/`
- Publish `apps/web/dist`

Environment variables:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000/ws/status
```

Phone on same Wi-Fi:

```env
VITE_API_BASE_URL=http://192.168.x.x:8000
VITE_WS_BASE_URL=ws://192.168.x.x:8000/ws/status
```

If the backend is unreachable, the UI stays in demo mode and shows `Demo Mode - No hardware connected`. Real controls are disabled while disconnected; Stop All stays visible and reports backend unavailable if it cannot send.

The Camera page can store multiple camera source URLs in this browser. Use trusted LAN camera URLs or private VPN URLs; do not expose camera feeds publicly.

Keep the backend private: no public port forwarding, no paid cloud backend, no paid database, no paid tunnel requirement, and no paid domain requirement. Full guide: `E:\SentinelRoom\docs\deployment_web.md`.
