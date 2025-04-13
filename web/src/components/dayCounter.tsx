"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const DayCounter = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchDayShiftCount = async () => {
      try {
        const res = await fetch("/api/get-log?shift=day");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCount(data.length);
      } catch (err) {
        console.error("Error fetching day shift count:", err);
        setCount(0);
      }
    };

    fetchDayShiftCount();
  }, []);

  return (
    <Card className="col-span-1 flex flex-col justify-center">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl font-bold">
          DAY SHIFT
        </CardTitle>
        <CardDescription className="text-center text-xs">
          7AM - 19PM
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold text-orange-500 text-center">
          {count}
        </div>
      </CardContent>
    </Card>
  );
};

export default DayCounter;
