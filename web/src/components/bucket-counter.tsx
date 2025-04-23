"use client";

import {
  getDayShiftEvents,
  getNightShiftEvents,
} from "@/services/events/eventsApi";
import { useTimeZone } from "@/stores/useMqttStore";
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";

const BucketCounter = () => {
  const timezone = useTimeZone();
  const [dayCount, setDayCount] = useState(0);
  const [nightCount, setNightCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setIsLoading(true);
        const dayEvents = await getDayShiftEvents(timezone);
        const nightEvents = await getNightShiftEvents(timezone);
        setDayCount(dayEvents.length);
        setNightCount(nightEvents.length);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, [timezone]);

  return (
    <Card className="">
      <CardContent className="h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-3xl font-bold">{dayCount + nightCount}</div>
          <div className="text-sm text-muted-foreground">Total Buckets</div>

          <div className="w-full grid grid-cols-2 gap-2 mt-3 text-center">
            <div className="bg-amber-100 rounded-md p-2">
              <div className="text-lg font-medium">{dayCount}</div>
              <div className="text-xs text-amber-800">Day Shift</div>
            </div>
            <div className="bg-indigo-100 rounded-md p-2">
              <div className="text-lg font-medium">{nightCount}</div>
              <div className="text-xs text-indigo-800">Night Shift</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BucketCounter;
