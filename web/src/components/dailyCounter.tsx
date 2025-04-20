"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { useTimeZone } from "@/stores/useMqttStore";

const DailyCounter = () => {
  const [count, setCount] = useState<number>(0);
  const timezone = useTimeZone();
  useEffect(() => {
    const fetchTodayShiftCount = async () => {
      if (!timezone) return;
      try {
        const res = await fetch(
          `/api/get-log?today=true&timezone=${encodeURIComponent(timezone)}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCount(data.length);
      } catch (err) {
        console.error("Error fetching today shift count:", err);
        setCount(0);
      }
    };

    fetchTodayShiftCount();
  }, [timezone]);

  return (
    <Card className="flex col-span-1 text-center align">
      <CardContent className="h-full flex flex-col place-content-center">
        <div className="text-2xl font-bold">TODAY</div>
        <div className="text-6xl font-bold text-blue-600">{count}</div>
      </CardContent>
    </Card>
  );
};

export default DailyCounter;
