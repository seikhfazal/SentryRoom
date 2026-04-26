import { useEffect, useState } from "react";
import { getBackendUrl, setBackendUrl, api } from "../api/client";
import type { Status } from "../api/types";
import { SafetyGate } from "../components/SafetyGate";

export function Settings({ status, connected }: { status: Status; connected: boolean }) {
  const [url, setUrl] = useState(getBackendUrl());
  const [networkUrl, setNetworkUrl] = useState("");
  const [pin, setPin] = useState("");

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
        <div className="panel-title">PIN Login</div>
        <input type="password" placeholder="PIN" value={pin} onChange={(event) => setPin(event.target.value)} />
        <button className="control-button safe" onClick={() => api.login(pin)} disabled={!connected} title={connected ? undefined : "Backend unavailable in demo mode"}>Login</button>
      </section>
      <section className="glass panel">
        <div className="panel-title">Device Status</div>
        <p>MQTT: 127.0.0.1:1883</p>
        <p>Mock mode: {String(status.mock_mode)}</p>
        <p>LAN mode is configured in `.env` and is off by default.</p>
      </section>
      <SafetyGate connected={connected} />
    </div>
  );
}
