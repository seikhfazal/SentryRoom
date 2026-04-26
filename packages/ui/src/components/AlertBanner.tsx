import type { Status } from "../api/types";

export function AlertBanner({ status }: { status: Status }) {
  const tone = status.system_state === "ALERT" || status.system_state === "LOCKDOWN" || status.system_state === "DEMO" ? "hot" : status.system_state === "SAFE_MODE" ? "safe" : "idle";
  return (
    <div className={`system-alert ${tone}`}>
      <div>
        <span className="eyebrow">System state</span>
        <h1>{status.message}</h1>
      </div>
      <strong>{status.system_state}</strong>
    </div>
  );
}
