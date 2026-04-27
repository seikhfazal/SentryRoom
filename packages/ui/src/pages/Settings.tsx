import { useEffect, useState } from "react";
import { getBackendUrl, setBackendUrl, api } from "../api/client";
import type { Status } from "../api/types";
import { SafetyGate } from "../components/SafetyGate";

export function Settings({
  status,
  connected,
  canControl,
  authenticated,
  onLock,
  onLoginRequest
}: {
  status: Status;
  connected: boolean;
  canControl: boolean;
  authenticated: boolean;
  onLock: () => void;
  onLoginRequest: () => void;
}) {
  const [url, setUrl] = useState(getBackendUrl());
  const [networkUrl, setNetworkUrl] = useState("");

  useEffect(() => {
    api.network().then((info) => setNetworkUrl(info.controller_url)).catch(() => setNetworkUrl("Unavailable"));
  }, []);

  return (
    <div className="page-grid">
      <section className="glass panel">
        <div className="panel-title">Backend Connection</div>
        <input value={url} onChange={(event) => setUrl(event.target.value)} />
        <button className="control-button" onClick={() => setBackendUrl(url)}>Save Backend URL</button>
        <p>Local controller URL: {networkUrl}</p>
        <button className="control-button" onClick={() => alert(networkUrl)}>Open Web Controller</button>
        <button className="control-button" onClick={() => alert("QR Code placeholder for " + networkUrl)}>Show QR Code</button>
      </section>
      <section className="glass panel">
        <div className="panel-title">Session Access</div>
        <p>{authenticated ? "PIN session active. Hardware commands are available while the backend is connected." : "Preview mode is active. Commands remain locked until PIN sign-in."}</p>
        <p className="muted">The PIN is read from the backend `.env` on this machine and is not stored in the public web build.</p>
        <button className={`control-button ${authenticated ? "danger" : "safe"}`} onClick={authenticated ? onLock : onLoginRequest}>
          {authenticated ? "Lock Console" : "Enter PIN"}
        </button>
      </section>
      <section className="glass panel">
        <div className="panel-title">Device Status</div>
        <p>MQTT: 127.0.0.1:1883</p>
        <p>Mock mode: {String(status.mock_mode)}</p>
        <p>Backend: {connected ? "Connected" : "Offline or public preview"}</p>
        <p>Controls: {canControl ? "Unlocked" : "Locked"}</p>
        <p>LAN mode is configured in `.env` and is off by default.</p>
      </section>
      <SafetyGate connected={connected} canControl={canControl} />
    </div>
  );
}
