"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const NightCounter = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchNightShiftCount = async () => {
      try {
        const res = await fetch("/api/get-log?shift=night");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCount(data.length);
      } catch (err) {
        console.error("Error fetching night shift count:", err);
        setCount(0);
      }
    };

    fetchNightShiftCount();
  }, []);
  return (
    <Card className="col-span-1 flex flex-col justify-center">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl font-bold">
          NIGHT SHIFT
        </CardTitle>
        <CardDescription className="text-center text-xs">
          19PM - 7AM
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold text-indigo-500 text-center">
          {count}
        </div>
      </CardContent>
    </Card>
  );
};

export default NightCounter;
