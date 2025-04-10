"use client";
import { useCallback, useEffect, useRef } from "react";
import mqtt, { MqttClient } from "mqtt";
import {
  useIsLogging,
  useMqttActions,
  useObjectCounts,
} from "@/stores/useMqttStore";

export const useMqttConnection = (mqttUri: string, topic: string) => {
  const clientRef = useRef<MqttClient | null>(null);
  const { setIsConnected, addLog, incrementObjectCount } = useMqttActions();
  const isLogging = useIsLogging();
  const objectCount = useObjectCounts();
  const isLoggingRef = useRef(isLogging);
  const objectCountRef = useRef(objectCount);

  useEffect(() => {
    isLoggingRef.current = isLogging;
    objectCountRef.current = objectCount;
  }, [isLogging, objectCount]);

  const connect = useCallback(() => {
    if (clientRef.current?.connected) return;

    const client = mqtt.connect(mqttUri, {
      reconnectPeriod: 1000,
    });

    clientRef.current = client;

    client.on("connect", () => {
      addLog("System connected - Connected to MQTT");
      setIsConnected(true);
      client.subscribe(topic);
    });

    client.on("message", (_topic, msg) => {
      const raw = msg.toString();

      try {
        const data = JSON.parse(raw);
        console.log(data);
        if (isLoggingRef.current) {
          if (data.type === "new") {
            incrementObjectCount();
            addLog("Bucket unloading initiated");
          } else if (data.type === "end") {
            addLog("Bucket unloading finished");
            if (
              typeof data?.after?.end_time === "number" &&
              typeof data?.after?.start_time === "number"
            ) {
              const duration = (
                data.after.end_time - data.after.start_time
              ).toFixed(2);
              addLog(
                `Current count: ${objectCountRef.current}, Total time unloading: ${duration}s`
              );
            }
            console.log(JSON.stringify(data));
            fetch("/api/save-log", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
          }
        }
      } catch (e) {
        console.error("Failed to parse/store message", e);
      }
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
    });
  }, [
    mqttUri,
    topic,
    isLogging,
    objectCount,
    addLog,
    incrementObjectCount,
    setIsConnected,
  ]);

  const disconnect = useCallback(() => {
    const client = clientRef.current;
    if (client) {
      client.unsubscribe(topic);
      client.end(true, () => {
        addLog("System disconnected - Disconnected from MQTT");
        setIsConnected(false);
      });
    }
    clientRef.current = null;
  }, [topic, addLog, setIsConnected]);

  return {
    connect,
    disconnect,
  };
};
