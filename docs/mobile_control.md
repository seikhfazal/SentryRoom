# Mobile Control

Phone control works on the same trusted Wi-Fi network.

Default backend binding is localhost. To allow phone access:

1. Set `SENTINEL_ALLOW_LAN=true` in `.env`.
2. Add the phone web origin to `SENTINEL_CORS_ORIGINS`, for example `http://192.168.x.x:5173`.
3. Start backend with `--host 0.0.0.0` only on trusted Wi-Fi.
4. Open `/api/network/info`.
5. Open the returned controller URL on the phone.

Do not port-forward Sentinel Room to the internet.

Phone quick actions:

- Arm
- Disarm
- Demo mode
- Stop all
- Lock
- Unlock
- Sentry idle
- Sentry scan
- Trigger cinematic alert demo

Manual mist test is hidden behind advanced confirmation and is fixed-direction only.

## Free Online Website Hosting

The phone controller can be opened from the free hosted web/PWA, but real controls still require the phone browser to reach the local/private backend.

Build:

```powershell
cd E:\SentinelRoom\apps\web
npm install
npm run build
```

Free hosting options:

- Cloudflare Pages, recommended.
- Vercel Hobby/free personal.
- Netlify Free.
- GitHub Pages fallback if the static build works for your routing needs.

Set frontend environment variables for the backend address:

```env
VITE_API_BASE_URL=http://192.168.x.x:8000
VITE_WS_BASE_URL=ws://192.168.x.x:8000/ws/status
```

Use this only on the same trusted Wi-Fi, or use a private/free VPN address from Tailscale or ZeroTier if available for your personal use case. Cloudflare Tunnel free can be used only as an advanced secured option. Do not use public port forwarding.

If the backend is unreachable, the phone UI shows `Demo Mode - No hardware connected`. Real action buttons are disabled. Stop All remains visible, but reports backend unavailable if it cannot send.

Keep hardware private:

- Backend runs on the Windows PC.
- ESP32/Arduino connects to local backend/MQTT.
- PIN/login is required for control actions.
- Stop All must always remain visible.
- No paid backend, paid database, paid tunnel, paid domain, or paid hosting add-on is required.

Full deployment guide: `docs/deployment_web.md`.
