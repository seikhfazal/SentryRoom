# Sentinel Room Desktop

Tauri Windows desktop app scaffold. It uses the shared Sentinel Room React UI and connects to the local FastAPI backend.

## Development

```powershell
cd E:\SentinelRoom\apps\desktop
npm install
npm run tauri:dev
```

## Windows build

Install Rust and the Tauri prerequisites, then:

```powershell
cd E:\SentinelRoom\apps\desktop
npm run tauri:build
```

The Windows app bundle appears under `src-tauri\target\release\bundle`. This is intended to feel like a normal installed Windows app while keeping all control traffic local.
