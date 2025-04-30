"use client";
import { useCallback, useEffect } from "react";
import mqtt from "mqtt";
import {
  useIsConnected,
  useMqttActions,
  useObjectCounts,
} from "@/stores/useMqttStore";
import { FrigateEvent } from "@/types/FrigateEvent";
import { createEvent } from "@/services/events/eventsApi";

export const useMqttConnection = (mqttUri: string, topic: string) => {
  const { setIsConnected, addLog, incrementObjectCount } = useMqttActions();
  const connected = useIsConnected();
  const objectCount = useObjectCounts();

  const connect = useCallback(() => {
    if (connected) return;

    const client = mqtt.connect(mqttUri, {
      clientId: "web-client",
      reconnectPeriod: 1000,
      clean: false,
    });

    client.on("connect", () => {
      // addLog("System connected - Connected to MQTT");
      setIsConnected(true);
      client.subscribe(topic);
    });

    client.on("message", (_topic, msg) => {
      const raw = msg.toString();

      try {
        const eventData: FrigateEvent = JSON.parse(raw);

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
              `Current count: ${objectCount}, Total time unloading: ${duration}s`
            );
          }
          createEvent(eventData);
        }
      } catch (e) {
        console.error("Failed to parse/store message", e);
      }
    });

    client.on("disconnect", () => {
      setIsConnected(false);
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
    });
  }, []);

  // Automatically connect on mount
  useEffect(() => {
    connect();
  }, [connect]);
};
