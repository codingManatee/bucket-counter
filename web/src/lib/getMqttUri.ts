export function getMqttUri(): string {
  // 1 – build‑time env (works on server and client)
  if (process.env.NEXT_PUBLIC_MQTT_URI) {
    return process.env.NEXT_PUBLIC_MQTT_URI;
  }

  // 2 – derive from page origin (only in browser)
  if (typeof window !== "undefined") {
    return `ws://${window.location.hostname}:9001`;
  }

  // 3 – sensible fallback for SSR phase
  return "ws://localhost:9001";
}
