"use client";

import { prisma } from "@/lib/db";
import { useState } from "react";

export default function ExamplePage() {
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    const samplePayload = {
      type: "end",
      before: {
        id: "1744191637.001712-cmgx8c",
        camera: "main_cam",
        start_time: 1744191637.001712,
        end_time: null,
        severity: "alert",
        thumb_path:
          "/media/frigate/clips/review/thumb-main_cam-1744191637.001712-cmgx8c.webp",
        data: {
          detections: ["1744191636.361095-dvbbbr"],
          objects: ["person"],
          sub_labels: [],
          zones: ["walking_zone"],
          audio: [],
        },
      },
      after: {
        id: "1744191637.001712-cmgx8c",
        camera: "main_cam",
        start_time: 1744191637.001712,
        end_time: 1744191640.568769,
        severity: "alert",
        thumb_path:
          "/media/frigate/clips/review/thumb-main_cam-1744191637.001712-cmgx8c.webp",
        data: {
          detections: ["1744191636.361095-dvbbbr"],
          objects: ["person"],
          sub_labels: [],
          zones: ["walking_zone"],
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

      setResponse("Success! Log saved.");
    } catch (err: any) {
      console.error(err);
      setResponse("Error: " + err.message);
    }
  };

  const handleGet = async () => {
    try {
      const res = await fetch("/api/get-log");
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
