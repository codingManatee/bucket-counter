"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Thermometer } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function BucketLoggerDemo() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRunning, setIsRunning] = useState(false);
  const [bunkerNumber, setBunkerNumber] = useState("1");
  const [temperature, setTemperature] = useState(25);
  const [currentBucket, setCurrentBucket] = useState(0);
  const [logEntries, setLogEntries] = useState([]);

  const scrollRef = useRef(null);
  const logTimerRef = useRef(null);
  const lastBucketRef = useRef(0);
  const lastTimeRef = useRef(new Date(2025, 2, 31, 8, 36, 0));

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Effect for random log generation
  useEffect(() => {
    if (isRunning) {
      logTimerRef.current = setInterval(() => {
        const nextBucket = lastBucketRef.current + 1;
        const randomDelay = Math.floor(Math.random() * 3) + 1; // 1-3 minute delay
        const nextTime = new Date(
          lastTimeRef.current.getTime() + randomDelay * 60000
        );

        const loadTime = Math.floor(Math.random() * 3) + 1; // 1-3 minutes loading time
        const loadEndTime = new Date(nextTime.getTime() + loadTime * 60000);

        // Format times
        const startTimeStr = formatCustomTime(nextTime);
        const endTimeStr = formatCustomTime(loadEndTime);
        const durationStr = formatDuration(loadTime);

        // Generate new entries
        const newEntries = [
          `Ковш №${nextBucket}. Начало разгрузки: ${startTimeStr}`,
          `Ковш №${nextBucket}. Загрузка завершена ${endTimeStr} - ${durationStr}`,
        ];

        // Random chance to add a pause entry
        if (Math.random() > 0.3) {
          const pauseTime = Math.floor(Math.random() * 3) + 1;
          const pauseStr = formatDuration(pauseTime);
          newEntries.push(`Пауза: время между подачей ковшей - ${pauseStr}`);
          // Update next time to account for pause
          lastTimeRef.current = new Date(
            loadEndTime.getTime() + pauseTime * 60000
          );
        } else {
          lastTimeRef.current = loadEndTime;
        }

        setLogEntries((prev) => [...newEntries, ...prev]);
        setCurrentBucket(nextBucket);
        lastBucketRef.current = nextBucket;
      }, Math.floor(Math.random() * 3000) + 3000); // Random interval between 3-6 seconds
    } else if (logTimerRef.current) {
      clearInterval(logTimerRef.current);
    }

    return () => {
      if (logTimerRef.current) {
        clearInterval(logTimerRef.current);
      }
    };
  }, [isRunning]);

  const formatCustomTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const mins = (minutes % 60).toString().padStart(2, "0");
    return `${hours}:${mins}:00`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (logTimerRef.current) {
      clearInterval(logTimerRef.current);
    }
    lastBucketRef.current = 0;
    setCurrentBucket(0);
    setLogEntries([]);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Bucket Logger</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-white border-white">
            <Clock className="w-4 h-4 mr-1" />
            {formatDate(currentTime)} {formatTime(currentTime)}
          </Badge>
          <Badge variant="outline" className="text-white border-white">
            <Thermometer className="w-4 h-4 mr-1" />
            Temp: +{temperature}°C
          </Badge>
          <Badge variant={isRunning ? "success" : "secondary"}>
            Status: {isRunning ? "Running" : "Idle"}
          </Badge>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 h-screen ">
        {/* Left side - Log */}
        <div className="md:col-span-3 h-full ">
          <div className="border rounded-md h-full bg-neutral-950">
            <div className="bg-slate-100 p-2 border-b">
              <h2 className="font-medium">Log:</h2>
            </div>
            <div className="flex flex-col ">
              <ScrollArea
                ref={scrollRef}
                className="h-full w-full p-2 flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-150px)] "
              >
                <div className="space-y-1 font-mono text-md text-orange-600">
                  {logEntries.map((entry, index) => (
                    <div key={index} className="py-0.5 ">
                      {entry}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        {/* Right side - Controls */}
        <div className="md:col-span-1 space-y-4 border p-4 rounded rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Bunker No:</span>
            <Select value={bunkerNumber} onValueChange={setBunkerNumber}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleStart}
              disabled={isRunning}
            >
              START
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handlePause}
              disabled={!isRunning}
            >
              PAUSE
            </Button>
            <Button variant="outline" onClick={handleReset}>
              RESET
            </Button>
            <Button variant="outline">GRAPH</Button>
          </div>

          <Card className="mt-4">
            <CardContent className="p-4 flex flex-col items-center">
              <h1 className="text-xl font-bold">BUCKET COUNT</h1>
              <span className="text-6xl font-bold text-blue-600">
                {currentBucket}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
