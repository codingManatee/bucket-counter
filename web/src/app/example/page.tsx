"use client";

import { useState } from "react";

export default function ExamplePage() {
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    const getRandomItem = <T,>(arr: T[]) =>
      arr[Math.floor(Math.random() * arr.length)];
    const getRandomString = () => Math.random().toString(36).substring(2, 10);
    const getRandomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const now = Math.floor(Date.now() / 1000);
    const startOffset = getRandomInt(-3600, 0); // 1h window
    const duration = getRandomInt(5, 30);

    const id = `${now + startOffset}.${
      Math.random().toFixed(6).split(".")[1]
    }-${getRandomString()}`;
    const camera = getRandomItem(["main_cam", "garage", "driveway"]);
    const severity = getRandomItem(["info", "alert", "critical"]);

    const samplePayload = {
      type: "end",
      before: {
        id,
        camera,
        start_time: now + startOffset,
        end_time: null,
        severity,
        thumb_path: `/media/frigate/clips/thumb-${camera}-${id}.webp`,
        data: {
          detections: ["det_" + getRandomString()],
          objects: ["person", "car", "dog"]
            .sort(() => 0.5 - Math.random())
            .slice(0, 1),
          sub_labels: [],
          zones: ["walking_zone", "entry", "garage_zone"]
            .sort(() => 0.5 - Math.random())
            .slice(0, 1),
          audio: [],
        },
      },
      after: {
        id,
        camera,
        start_time: now + startOffset,
        end_time: now + startOffset + duration,
        severity,
        thumb_path: `/media/frigate/clips/thumb-${camera}-${id}.webp`,
        data: {
          detections: ["det_" + getRandomString()],
          objects: ["person", "car", "dog"]
            .sort(() => 0.5 - Math.random())
            .slice(0, 1),
          sub_labels: [],
          zones: ["walking_zone", "entry", "garage_zone"]
            .sort(() => 0.5 - Math.random())
            .slice(0, 1),
          audio: [],
        },
      },
    };

    try {
      const res = await fetch("/api/save-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(samplePayload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Unknown error");

      setResponse("Success! Random log saved.");
    } catch (err: any) {
      console.error(err);
      setResponse("Error: " + err.message);
    }
  };

  const handleGet = async () => {
    try {
      const res = await fetch("/api/get-all-log");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Test Save Log</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleSend}
      >
        Send Sample Log
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleGet}
      >
        Get Sample Log
      </button>
      <p className="mt-4 text-gray-800">{response}</p>
    </div>
  );
}
