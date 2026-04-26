import { Camera, Gauge, List, Radar, Settings as SettingsIcon, SlidersHorizontal, Smartphone } from "lucide-react";

export const navItems = [
  { path: "/", label: "Dashboard", icon: Gauge },
  { path: "/camera", label: "Camera", icon: Camera },
  { path: "/sentry", label: "Sentry", icon: Radar },
  { path: "/calibration", label: "Calibration", icon: SlidersHorizontal },
  { path: "/events", label: "Events", icon: List },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
  { path: "/mobile", label: "Mobile", icon: Smartphone }
];
