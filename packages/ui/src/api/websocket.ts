import { getStatusSocketUrl } from "./client";
import type { Status } from "./types";

export function connectStatusSocket(onStatus: (status: Status) => void, onDisconnect: () => void) {
  const socket = new WebSocket(getStatusSocketUrl());
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "status") onStatus(message.payload);
  };
  socket.onclose = onDisconnect;
  socket.onerror = onDisconnect;
  return socket;
}
