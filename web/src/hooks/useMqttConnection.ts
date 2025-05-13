"use client";
import { useCallback, useEffect } from "react";
import mqtt from "mqtt";
import {
  useConnectionStatus,
  useMqttActions,
  useMqttStore,
} from "@/stores/useMqttStore";

import {
  createEvent,
  getDayShiftEvents,
  getNightShiftEvents,
} from "@/services/events/eventsApi";
import { getMqttUri } from "@/lib/getMqttUri";
import { FrigateEventMessage } from "@prisma/client";
import { setHours, isBefore, format, isAfter, startOfDay } from "date-fns";
import { FrigateEvent } from "@/types/frigateEvent";

export const useMqttConnection = (topic: string, explicitUri?: string) => {
  const { addLog, setConnectionStatus } = useMqttActions();
  const connectionStatus = useConnectionStatus();
  const mqttUri = explicitUri ?? getMqttUri();

  const connect = useCallback(() => {
    if (connectionStatus === "connected") return;

    const client = mqtt.connect(mqttUri, {
      clientId: `web-client-${Math.random().toString(16).slice(2)}`,
      reconnectPeriod: 1000,
      clean: false,
    });

    client.on("connect", () => {
      setConnectionStatus("connected");
      client.subscribe(topic);
    });

    client.on("message", async (_topic, msg) => {
      const raw = msg.toString();

      const loggingStatus = useMqttStore.getState().loggingStatus;
      if (loggingStatus === "hault") return;

      try {
        const eventData: FrigateEvent = JSON.parse(raw);

        if (eventData.before.severity !== "alert" || eventData.type !== "end")
          return;

        // 1) store the event first
        await createEvent(eventData);

        // 2) compute local time
        const nowLocal = new Date();
        const dateLabel = format(nowLocal, "dd.MM");

        // 3) build our shift cutoffs (today at 08:00 & 20:00)
        const dayStart = startOfDay(new Date(nowLocal));
        const morningCutoff = setHours(dayStart, 8);
        const eveningCutoff = setHours(dayStart, 20);

        // 4) decide which shift we're in
        const isShift1 =
          isAfter(nowLocal, morningCutoff) && isBefore(nowLocal, eveningCutoff);
        const shiftNumber = isShift1 ? 1 : 2;

        // 6) fetch fresh events so our bucket count is correct
        // Server action require timezone
        const timezone = useMqttStore.getState().timezone;
        const events: FrigateEventMessage[] = isShift1
          ? await getDayShiftEvents(timezone)
          : await getNightShiftEvents(timezone);
        const bucketNumber = events.length;

        if (bucketNumber === 1) {
          addLog(`[${dateLabel}] Shift ${shiftNumber} started`);
        }

        // 7) compute duration
        let durationSec = 0;
        if (
          typeof eventData.after?.start_time === "number" &&
          typeof eventData.after?.end_time === "number"
        ) {
          durationSec = eventData.after.end_time - eventData.after.start_time;
        }
        const durationStr = durationSec.toFixed(2);

        const bucketLog = `[${dateLabel}] Shift ${shiftNumber} – Bucket #${bucketNumber} – Total time: ${durationStr} s`;

        const logEntry = durationSec < 20 ? `⚠️ ${bucketLog}` : bucketLog;

        addLog(logEntry);
      } catch (err) {
        console.error("Failed to handle end-event", err);
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
