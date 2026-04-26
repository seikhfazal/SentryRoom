import { Wifi, WifiOff } from "lucide-react";

export function ConnectionStatus({ connected, mockMode }: { connected: boolean; mockMode: boolean }) {
  return (
    <div className={`connection ${connected ? "online" : "offline"}`}>
      {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
      <span>{connected ? "Backend connected" : "Offline or disconnected"}</span>
      {mockMode && <b>Demo Mode</b>}
    </div>
  );
}
