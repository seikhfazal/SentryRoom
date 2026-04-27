# Remote Access

Sentinel Room has two remote-access paths. Keep them separate.

## Public Friend Demo

Use this for friends, screenshots, and online demos.

- Frontend: GitHub Pages.
- Backend: free online mock/demo backend.
- Hardware: disabled.
- MQTT: disabled.
- Safety flag: `SENTINEL_PUBLIC_DEMO=true`.

Public demo links can carry a backend URL:

```text
https://seikhfazal.github.io/SentryRoom/?backend=https%3A%2F%2Fyour-demo-backend.onrender.com
https://seikhfazal.github.io/SentryRoom/mobile/?backend=https%3A%2F%2Fyour-demo-backend.onrender.com
```

Use only an HTTPS mock backend for these public links. Do not connect a public backend to ESP32, Arduino, MQTT, camera feeds, or real room hardware.

## Private Remote Control

Use this when you are outside and want to control your own local setup.

Recommended path:

1. Install Tailscale or ZeroTier on the Windows laptop.
2. Install the same VPN app on your phone.
3. Join both devices to the same private network.
4. Keep the laptop plugged in and awake.
5. Open the mobile controller through the laptop's private VPN IP:

```text
http://<tailscale-or-zerotier-ip>:5173/mobile/
```

This keeps hardware control private. Do not use router port forwarding for ports `5173`, `8000`, `1883`, camera feeds, or SQLite files.

## Local Services

Backend:

```text
http://<private-ip>:8000
```

Frontend:

```text
http://<private-ip>:5173/
http://<private-ip>:5173/mobile/
```

The backend must allow the frontend origin in `SENTINEL_CORS_ORIGINS`.
