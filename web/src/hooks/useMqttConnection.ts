"use client";
import { useCallback, useEffect, useRef } from "react";
import mqtt, { MqttClient } from "mqtt";
import {
  useIsLogging,
  useMqttActions,
  useObjectCounts,
} from "@/stores/useMqttStore";
import { FrigateEvent } from "@/types/FrigateEvent";
import { createEvent } from "@/services/events/eventsApi";

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
      clientId: "web-client",
      reconnectPeriod: 1000,
      clean: false,
    });

    clientRef.current = client;

    client.on("connect", () => {
      addLog("System connected - Connected to MQTT");
      setIsConnected(true);
      client.subscribe(topic);
    });

    client.on("reconnect", () => {});

    client.on("message", (_topic, msg) => {
      const raw = msg.toString();

      try {
        const eventData: FrigateEvent = JSON.parse(raw);
        if (isLoggingRef.current) {
          if (eventData.type === "new") {
            incrementObjectCount();
            addLog("Bucket unloading initiated");
          } else if (eventData.type === "end") {
            addLog("Bucket unloading finished");
            if (
              typeof eventData?.after?.end_time === "number" &&
              typeof eventData?.after?.start_time === "number"
            ) {
              const duration = (
                eventData.after.end_time - eventData.after.start_time
              ).toFixed(2);
              addLog(
                `Current count: ${objectCountRef.current}, Total time unloading: ${duration}s`
              );
            }

            createEvent(eventData);
          }
        }
      } catch (e) {
        console.error("Failed to parse/store message", e);
      }
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
    });
  }, []);

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
