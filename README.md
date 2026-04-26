# Sentinel Room

[![Web and Backend CI](https://github.com/seikhfazal/SentryRoom/actions/workflows/ci.yml/badge.svg)](https://github.com/seikhfazal/SentryRoom/actions/workflows/ci.yml)
[![Deploy Web PWA](https://github.com/seikhfazal/SentryRoom/actions/workflows/web-pages.yml/badge.svg)](https://github.com/seikhfazal/SentryRoom/actions/workflows/web-pages.yml)
![React](https://img.shields.io/badge/React-TypeScript-4aa3ff)
![FastAPI](https://img.shields.io/badge/FastAPI-SQLite-54d67a)
![ESP32](https://img.shields.io/badge/ESP32-Arduino-ffd166)
![Safety](https://img.shields.io/badge/Safety-Local--First-ff4d5e)

Sentinel Room is a safe, local-first smart-room security prototype that combines a FastAPI backend, React web/PWA dashboard, Tauri desktop app, ESP32/Arduino firmware, MQTT, SQLite, Wokwi simulation, and OpenCV-based vision demos.

The project is intentionally cinematic but non-weaponized. The red "pseudo-laser" is only a normal low-power red LED with a resistor. The system does not use weapon logic, projectile firing, body/face/torso aiming, or automatic spray/mist at people.

## Project Author

Built by **Seikh Mohammed Fazal Ahmad**, first-year B.Tech student in **Computer Science and Engineering** at **National Institute of Technology Jamshedpur**.

This project is designed as a portfolio-grade engineering prototype: practical enough to run locally, documented enough to reproduce, and safety-bounded enough to demonstrate responsibly.

## Highlights

- Local-first hardware control with backend and MQTT kept private by default.
- Web/PWA dashboard built with Vite, React, TypeScript, and shared UI components.
- Phone control route at `/mobile` for same-Wi-Fi use.
- Tauri desktop scaffold using the same React interface.
- ESP32 firmware with servo limits, Stop All, MQTT failsafe, and safe demo behavior.
- Wokwi simulation for testing before touching hardware.
- Multi-camera source manager in the Camera page, stored locally in the browser.
- OpenCV mannequin/person-like form detection that reports only `left`, `center`, `right`, or `lost`.
- Free static deployment support for Cloudflare Pages, Vercel Hobby, Netlify Free, and GitHub Pages fallback.

## Architecture

```text
apps/web          Vite + React + TypeScript PWA dashboard
apps/desktop      Tauri desktop shell using the shared React UI
packages/ui       Shared dashboard pages, components, API client, styles
backend           FastAPI + SQLite + WebSocket + MQTT relay
firmware          ESP32 Arduino firmware and component test sketches
simulation/wokwi  Virtual ESP32 hardware simulation
vision            OpenCV demo scripts
docs              Build, deployment, safety, wiring, and API docs
```

## Quick Start

Start the backend in mock mode:

```powershell
cd E:\SentinelRoom
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
copy .env.example .env
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Start the web dashboard:

```powershell
cd E:\SentinelRoom\apps\web
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
http://127.0.0.1:5173/mobile
```

Default demo PIN:

```text
1234
```

## Build And Test

Web production build:

```powershell
cd E:\SentinelRoom\apps\web
npm install
npm run build
```

Backend tests:

```powershell
cd E:\SentinelRoom
.\.venv\Scripts\python.exe -m pytest backend\tests
```

Current local validation:

```text
Web build passed.
Backend tests: 12 passed.
```

## Free Online Website Hosting

The web/PWA dashboard can be hosted online for free as a static site. The real backend, MQTT broker, SQLite database, ESP32, and Arduino hardware stay local/private by default.

Recommended host: **Cloudflare Pages**.

Free alternatives:

- Vercel Hobby/free personal deployment.
- Netlify Free.
- GitHub Pages fallback when compatible.

Frontend environment variables:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000/ws/status
```

For phone control on the same trusted Wi-Fi:

```env
VITE_API_BASE_URL=http://192.168.x.x:8000
VITE_WS_BASE_URL=ws://192.168.x.x:8000/ws/status
```

If the backend is unreachable, the deployed dashboard still opens in demo mode and shows:

```text
Demo Mode - No hardware connected
```

Full guide: [docs/deployment_web.md](docs/deployment_web.md).

## Hardware Safety

Hard safety rules:

- No real laser module.
- No weapon logic.
- No projectile firing.
- No body, face, or torso aiming.
- No automatic mist/spray at people.
- Stop All must turn off LED, buzzer, demo/mist behavior, and center/idle servos.
- Do not expose the backend or MQTT broker to the public internet.

See [SAFETY.md](SAFETY.md), [HARDWARE.md](HARDWARE.md), and [docs/pin_map.md](docs/pin_map.md).

## Firmware

Main ESP32 Arduino IDE sketch:

```text
firmware\esp32_sentinel_node\esp32_sentinel_node.ino
```

Standalone component tests:

```text
firmware\component_tests
```

Required Arduino libraries:

```text
ESP32Servo
PubSubClient
```

## Documentation

- [Deployment guide](docs/deployment_web.md)
- [Mobile control](docs/mobile_control.md)
- [Web/PWA notes](docs/web_pwa.md)
- [Materials and wiring](docs/materials_and_wiring.md)
- [Pin map](docs/pin_map.md)
- [Testing](TESTING.md)
- [Future assistant integration placeholder](docs/assistant_integration.md)

## License Notes

This project uses free and open-source tools and does not require paid APIs, paid UI kits, paid icons, paid fonts, paid cloud databases, paid tunnels, paid domains, or paid hosting. See [LICENSE_NOTES.md](LICENSE_NOTES.md).
