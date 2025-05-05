"use client";
import { useEffect, useRef } from "react";

import {
  useMqttActions,
  useSelectedShiftDisplay,
  useTimeZone,
} from "@/stores/useMqttStore";
import { getShift } from "@/lib/getShift";

export const useShiftReset = () => {
  const { resetCounter, resetLog, setSelectedShiftDisplay } = useMqttActions();
  const currentShift = useSelectedShiftDisplay();
  const timezone = useTimeZone();

  const prevShiftRef = useRef(currentShift);

  useEffect(() => {
    const id = setInterval(() => {
      const nowShift = getShift(new Date(), timezone);

      if (nowShift !== prevShiftRef.current) {
        resetCounter();
        // resetLog();
        setSelectedShiftDisplay(nowShift);
        prevShiftRef.current = nowShift;
      }
    }, 60_000); // check once a minute

    return () => clearInterval(id);
  }, [resetCounter, resetLog, setSelectedShiftDisplay, timezone]);
};
