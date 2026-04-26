# Web PWA

The web dashboard is built with Vite + React.

Features:

- Responsive dashboard.
- PWA manifest.
- Desktop sidebar navigation.
- Mobile bottom navigation.
- `/mobile` phone-first controller page.
- Large touch controls.
- Multi-camera source manager saved in browser storage.

Run:

```powershell
cd E:\SentinelRoom\apps\web
npm install
npm run dev
```

## Free Online Website Hosting

The PWA dashboard can be deployed online for free as a static Vite site. The online frontend is only the control dashboard UI; the FastAPI backend, MQTT broker, database, and ESP32/Arduino hardware stay local/private by default.

Build:

```powershell
cd E:\SentinelRoom\apps\web
npm install
npm run build
```

Free hosting options:

- Cloudflare Pages, recommended: root `apps/web`, build `npm install && npm run build`, output `dist`.
- Vercel Hobby/free personal: root `apps/web`, framework `Vite`, build `npm install && npm run build`, output `dist`.
- Netlify Free: base `apps/web`, build `npm install && npm run build`, publish `apps/web/dist`.
- GitHub Pages fallback: build with `VITE_BASE_PATH=/SentryRoom/`, publish `apps/web/dist`.

Environment variables:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000/ws/status
```

Phone on same trusted Wi-Fi:

```env
VITE_API_BASE_URL=http://192.168.x.x:8000
VITE_WS_BASE_URL=ws://192.168.x.x:8000/ws/status
```

If the backend is unreachable, the app shows `Demo Mode - No hardware connected`, keeps navigation available, disables real control buttons, and keeps Stop All visible with a backend-unavailable message.

The camera page can store multiple camera source URLs in the browser. Use LAN camera URLs or private VPN URLs; do not expose camera feeds publicly.

Do not expose hardware controls publicly. Do not use public port forwarding. Do not require paid hosting, paid APIs, paid UI kits, paid icons, paid fonts, paid cloud databases, paid tunnels, or paid domains.

Full deployment guide: `docs/deployment_web.md`.
