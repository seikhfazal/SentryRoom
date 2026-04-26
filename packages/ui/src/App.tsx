import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { api } from "./api/client";
import { connectStatusSocket } from "./api/websocket";
import type { EventLog, Status } from "./api/types";
import { AssistantDock } from "./components/AssistantDock";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { SystemBanner } from "./components/SystemBanner";
import { Calibration } from "./pages/Calibration";
import { Camera } from "./pages/Camera";
import { Dashboard } from "./pages/Dashboard";
import { Events } from "./pages/Events";
import { MobileControl } from "./pages/MobileControl";
import { Sentry } from "./pages/Sentry";
import { Settings } from "./pages/Settings";
import { navItems } from "./routes";
import "./styles/theme.css";
import "./styles/globals.css";

const fallbackStatus: Status = {
  system_state: "SAFE_MODE",
  sentry_state: "SAFE_MODE",
  device_online: false,
  mock_mode: true,
  door_open: false,
  motion_detected: false,
  mannequin_detected: false,
  mannequin_region: "lost",
  mannequin_confidence: 0,
  pseudo_laser_on: false,
  pseudo_laser_pwm: 0,
  buzzer_on: false,
  mist_enabled: false,
  pan: 90,
  tilt: 80,
  rgb: "offline",
  message: "Offline or disconnected"
};

function Shell() {
  const location = useLocation();
  const [status, setStatus] = useState<Status>(fallbackStatus);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [connected, setConnected] = useState(false);
  const isMobileRoute = location.pathname === "/mobile";

  const refresh = () => {
    api.status().then((next) => { setStatus(next); setConnected(true); }).catch(() => setConnected(false));
    api.events().then(setEvents).catch(() => setEvents([]));
  };

  useEffect(() => {
    const timer = window.setTimeout(refresh, 450);
    let socket: WebSocket | undefined;
    try {
      socket = connectStatusSocket((next) => { setStatus(next); setConnected(true); }, () => setConnected(false));
    } catch {
      setConnected(false);
    }
    return () => { window.clearTimeout(timer); socket?.close(); };
  }, []);

  if (isMobileRoute) return <Routes><Route path="/mobile" element={<MobileControl status={status} refresh={refresh} connected={connected} />} /></Routes>;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark" /> Sentinel Room</div>
        <nav>{navItems.map((item) => <NavLink key={item.path} to={item.path} end={item.path === "/"}><item.icon size={17} /> {item.label}</NavLink>)}</nav>
      </aside>
      <main className="workspace">
        <header className="topbar">
          <ConnectionStatus connected={connected} mockMode={status.mock_mode} />
        </header>
        <AssistantDock />
        <SystemBanner status={status} refresh={refresh} connected={connected} />
        <Routes>
          <Route path="/" element={<Dashboard status={status} events={events} refresh={refresh} connected={connected} />} />
          <Route path="/camera" element={<Camera status={status} />} />
          <Route path="/sentry" element={<Sentry status={status} refresh={refresh} connected={connected} />} />
          <Route path="/calibration" element={<Calibration status={status} refresh={refresh} connected={connected} />} />
          <Route path="/events" element={<Events events={events} refresh={refresh} />} />
          <Route path="/settings" element={<Settings status={status} connected={connected} />} />
        </Routes>
      </main>
      <nav className="bottom-nav">{navItems.slice(0, 6).map((item) => <NavLink key={item.path} to={item.path} end={item.path === "/"}><item.icon size={18} /><span>{item.label}</span></NavLink>)}</nav>
    </div>
  );
}

export default function App() {
  return <BrowserRouter><Shell /></BrowserRouter>;
}
