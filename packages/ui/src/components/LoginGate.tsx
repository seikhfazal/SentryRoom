import { FormEvent, useState } from "react";
import { LockKeyhole, Radar, ShieldCheck, Wifi, WifiOff } from "lucide-react";
import { api, getBackendUrl } from "../api/client";
import type { Status } from "../api/types";

export function LoginGate({
  status,
  connected,
  onAuthenticated,
  onPreview,
  mobile = false
}: {
  status: Status;
  connected: boolean;
  onAuthenticated: () => void;
  onPreview?: () => void;
  mobile?: boolean;
}) {
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextPin = pin.trim();
    if (!nextPin) {
      setError("Enter the local console PIN.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api.login(nextPin);
      setPin("");
      onAuthenticated();
    } catch {
      setError(connected ? "PIN rejected by the local backend." : "Local backend is offline. Start it to unlock controls.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className={`login-page ${mobile ? "mobile-login" : ""}`}>
      <section className="login-hero">
        <div className="login-brand">
          <span className="brand-mark" />
          <div>
            <strong>Sentinel Room</strong>
            <small>Local security operations console</small>
          </div>
        </div>
        <div className="login-radar" aria-hidden="true">
          <span />
          <span />
          <Radar size={48} />
        </div>
        <span className="eyebrow">Private room command layer</span>
        <h1>Secure access for a cinematic smart-room prototype.</h1>
        <p>
          The public website can show the interface, but hardware commands stay behind a local PIN session on your
          machine or trusted LAN.
        </p>
        <div className="login-metrics">
          <span><ShieldCheck size={16} /> Controls require token</span>
          <span>{connected ? <Wifi size={16} /> : <WifiOff size={16} />} {connected ? "Backend online" : "Offline preview"}</span>
          <span>{status.mock_mode ? "Demo mode" : "Hardware mode"}</span>
        </div>
      </section>

      <form className="glass login-panel" onSubmit={submit}>
        <div>
          <span className="eyebrow">Operator verification</span>
          <h2>Enter PIN</h2>
          <p className="muted">No username, no cloud account, no public hardware tunnel.</p>
        </div>
        <label>
          <span>Local PIN</span>
          <input
            autoFocus={!mobile}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="PIN"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
        </label>
        {error && <p className="login-error">{error}</p>}
        <button className="control-button safe auth-button" type="submit" disabled={busy}>
          <LockKeyhole size={18} />
          {busy ? "Checking" : "Unlock Console"}
        </button>
        {!connected && onPreview && (
          <button className="preview-link" type="button" onClick={onPreview}>
            View offline demo preview
          </button>
        )}
        <small className="muted">Backend target: {getBackendUrl()}</small>
      </form>
    </main>
  );
}
