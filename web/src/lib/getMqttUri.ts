export function getMqttUri(): string {
  if (process.env.NEXT_PUBLIC_MQTT_URI) {
    return process.env.NEXT_PUBLIC_MQTT_URI;
  }

  if (typeof window !== "undefined") {
    return `ws://${window.location.hostname}:9001`;
  }

  return "ws://localhost:9001";
}
