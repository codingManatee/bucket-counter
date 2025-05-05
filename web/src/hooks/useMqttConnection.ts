"use client";
import { useCallback, useEffect } from "react";
import mqtt from "mqtt";
import {
  useConnectionStatus,
  useMqttActions,
  useMqttStore,
} from "@/stores/useMqttStore";

import { createEvent } from "@/services/events/eventsApi";
import { FrigateEvent } from "@/types/frigateEvent";

export const useMqttConnection = (mqttUri: string, topic: string) => {
  const { addLog, incrementObjectCount, setConnectionStatus } =
    useMqttActions();
  const connectionStatus = useConnectionStatus();

  const connect = useCallback(() => {
    if (connectionStatus === "connected") return;

    const client = mqtt.connect(mqttUri, {
      clientId: "web-client",
      reconnectPeriod: 1000,
      clean: false,
    });

    client.on("connect", () => {
      setConnectionStatus("connected");
      client.subscribe(topic);
    });

    client.on("message", (_topic, msg) => {
      const raw = msg.toString();

      const loggingStatus = useMqttStore.getState().loggingStatus;
      if (loggingStatus === "hault") return;

      try {
        const eventData: FrigateEvent = JSON.parse(raw);

        if (eventData.before.severity !== "alert") return;

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
            const count = useMqttStore.getState().objectCount;
            addLog(
              `Current count: ${count}, Total time unloading: ${duration}s`
            );
          }
          createEvent(eventData);
        }
      } catch (e) {
        console.error("Failed to parse/store message", e);
      }
    });

    client.on("reconnect", () => {
      if (connectionStatus !== "reconnecting") {
        setConnectionStatus("reconnecting");
      }
    });

    client.on("disconnect", () => {
      setConnectionStatus("disconnected");
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
