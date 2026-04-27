import type { CalibrationPoint, EventLog, SentryState, SentryUnit, Status } from "./types";

const tokenKey = "sentinel-room-token";
const authEventName = "sentinel-room-auth-change";

const defaultApiBaseUrl = "http://localhost:8000";
const defaultWsBaseUrl = "ws://localhost:8000/ws/status";

function envValue(key: "VITE_API_BASE_URL" | "VITE_WS_BASE_URL") {
  const meta = import.meta as unknown as { env?: Record<string, string | undefined> };
  return meta.env?.[key];
}

function queryValue(...keys: string[]) {
  const params = new URLSearchParams(window.location.search);
  for (const key of keys) {
    const value = params.get(key)?.trim();
    if (value) return value;
  }
  return "";
}

function normalizeUrl(url: string) {
  return url.trim().replace(/\/$/, "");
}

export function getBackendUrl() {
  const linkedBackendUrl = queryValue("backend", "api");
  if (linkedBackendUrl) {
    const normalized = normalizeUrl(linkedBackendUrl);
    localStorage.setItem("sentinel-backend-url", normalized);
    return normalized;
  }
  return normalizeUrl(localStorage.getItem("sentinel-backend-url") || envValue("VITE_API_BASE_URL") || defaultApiBaseUrl);
}

export function getStatusSocketUrl() {
  const linkedWsUrl = queryValue("ws", "websocket");
  if (linkedWsUrl) {
    localStorage.setItem("sentinel-ws-url", linkedWsUrl.trim());
    return linkedWsUrl.trim();
  }
  const savedWsUrl = localStorage.getItem("sentinel-ws-url");
  if (savedWsUrl) return savedWsUrl;
  if (localStorage.getItem("sentinel-backend-url")) return getBackendUrl().replace(/^http/, "ws") + "/ws/status";
  return envValue("VITE_WS_BASE_URL") || defaultWsBaseUrl;
}

export function setBackendUrl(url: string) {
  localStorage.setItem("sentinel-backend-url", normalizeUrl(url));
  localStorage.removeItem("sentinel-ws-url");
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function setToken(token: string) {
  localStorage.setItem(tokenKey, token);
  window.dispatchEvent(new Event(authEventName));
}

export function clearToken() {
  localStorage.removeItem(tokenKey);
  window.dispatchEvent(new Event(authEventName));
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${getBackendUrl()}${path}`, { ...options, headers });
  if (response.status === 401) {
    clearToken();
  }
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export const api = {
  status: () => request<Status>("/api/status"),
  events: () => request<EventLog[]>("/api/events"),
  login: async (pin: string) => {
    const result = await request<{ token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ pin }) });
    setToken(result.token);
    return result;
  },
  logout: async () => {
    try {
      await request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
    } finally {
      clearToken();
    }
  },
  arm: () => request("/api/arm", { method: "POST" }),
  disarm: () => request("/api/disarm", { method: "POST" }),
  lock: () => request("/api/lock", { method: "POST" }),
  unlock: () => request("/api/unlock", { method: "POST" }),
  stopAll: () => request("/api/stop-all", { method: "POST" }),
  demoStart: () => request("/api/demo/start", { method: "POST" }),
  demoStop: () => request("/api/demo/stop", { method: "POST" }),
  setMode: (mode: SentryState) => request("/api/sentry/mode", { method: "POST", body: JSON.stringify({ mode }) }),
  move: (pan: number, tilt: number) => request("/api/sentry/move", { method: "POST", body: JSON.stringify({ pan, tilt }) }),
  sentryUnits: () => request<SentryUnit[]>("/api/sentry/units"),
  calibration: () => request<CalibrationPoint[]>("/api/sentry/calibration"),
  saveCalibration: (name: string, pan: number, tilt: number) =>
    request("/api/sentry/calibration/save", { method: "POST", body: JSON.stringify({ name, pan, tilt }) }),
  quickAction: (action: string) => request("/api/mobile/quick-action", { method: "POST", body: JSON.stringify({ action }) }),
  network: () => request<{ controller_url: string; backend_url: string; warning: string }>("/api/network/info"),
  manualMist: (confirmation: boolean) => request("/api/mist/manual-test", { method: "POST", body: JSON.stringify({ confirmation }) })
};
