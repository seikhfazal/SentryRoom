import { useEffect, useState } from "react";
import type { Status } from "../api/types";
import { CameraPanel, type CameraFeed } from "../components/CameraPanel";
import { ControlButton } from "../components/ControlButton";

const cameraStorageKey = "sentinel-room-camera-feeds";
const defaultFeeds: CameraFeed[] = [
  { id: "primary", name: "Primary Room Camera", location: "Local preview", url: "" }
];

function loadCameraFeeds() {
  try {
    const saved = localStorage.getItem(cameraStorageKey);
    return saved ? JSON.parse(saved) as CameraFeed[] : defaultFeeds;
  } catch {
    return defaultFeeds;
  }
}

export function Camera({ status }: { status: Status }) {
  const [feeds, setFeeds] = useState<CameraFeed[]>(loadCameraFeeds);
  const [selectedId, setSelectedId] = useState(feeds[0]?.id || "primary");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [url, setUrl] = useState("");
  const selectedFeed = feeds.find((feed) => feed.id === selectedId) || feeds[0];

  useEffect(() => {
    localStorage.setItem(cameraStorageKey, JSON.stringify(feeds));
    if (!feeds.some((feed) => feed.id === selectedId)) setSelectedId(feeds[0]?.id || "primary");
  }, [feeds, selectedId]);

  const addCamera = () => {
    const nextName = name.trim();
    if (!nextName) return;
    const nextFeed: CameraFeed = {
      id: crypto.randomUUID(),
      name: nextName,
      location: location.trim() || "Unlabeled area",
      url: url.trim()
    };
    setFeeds((current) => [...current, nextFeed]);
    setSelectedId(nextFeed.id);
    setName("");
    setLocation("");
    setUrl("");
  };

  const removeCamera = (id: string) => {
    setFeeds((current) => current.length > 1 ? current.filter((feed) => feed.id !== id) : current);
  };

  return (
    <div className="page-grid">
      <CameraPanel feed={selectedFeed} />
      <section className="glass panel">
        <div className="panel-title">Camera Sources</div>
        <div className="camera-source-list">
          {feeds.map((feed) => (
            <button key={feed.id} className={feed.id === selectedId ? "active" : ""} onClick={() => setSelectedId(feed.id)}>
              <span>
                <strong>{feed.name}</strong>
                <small>{feed.location}</small>
              </span>
              <em>{feed.url ? "Feed URL set" : "Preview only"}</em>
            </button>
          ))}
        </div>
      </section>
      <section className="glass panel">
        <div className="panel-title">Add Camera</div>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Camera name" />
        <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Room or angle" />
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Stream or snapshot URL" />
        <div className="button-row">
          <ControlButton tone="safe" onClick={addCamera}>Add Camera</ControlButton>
          <ControlButton tone="danger" onClick={() => selectedFeed && removeCamera(selectedFeed.id)} disabled={feeds.length <= 1}>Remove Selected</ControlButton>
        </div>
        <p className="muted">Camera feeds are saved in this browser only. Use local LAN URLs or private VPN URLs for real cameras.</p>
      </section>
      <section className="glass panel">
        <div className="panel-title">Tracking Status</div>
        <p>ArUco marker tracking demo: left, center, right, or lost.</p>
        <p>Mannequin/human-form detection: {status.mannequin_detected ? `detected in ${status.mannequin_region} (${Math.round(status.mannequin_confidence * 100)}%)` : "clear or inactive"}.</p>
        <p>Person or mannequin detection is logging/display only and is not converted into servo aim points.</p>
      </section>
      <section className="glass panel">
        <div className="panel-title">Snapshot</div>
        <p className="muted">Snapshot placeholder for future webcam integration.</p>
      </section>
    </div>
  );
}
