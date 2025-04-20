"use client";

import {
  createEvent,
  getAllEvents,
  getDayShiftEvents,
  getDayShiftEventsGrouped,
  getNightShiftEvents,
  getNightShiftEventsGrouped,
} from "@/services/events/eventsApi";
import { useTimeZone } from "@/stores/useMqttStore";
import { generateRandomPayload } from "@/utils/helper";

export default function ExamplePage() {
  const timezone = useTimeZone();
  return (
    <div className="p-6 mx-auto space-x-2">
      <h1 className="text-xl font-semibold mb-4">test save log</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          createEvent(generateRandomPayload());
        }}
      >
        create sample event
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          getAllEvents();
        }}
      >
        get all event
      </button>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          getDayShiftEvents(timezone);
        }}
      >
        get sample event day shift
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          getDayShiftEventsGrouped(timezone);
        }}
      >
        get sample event day shift grouped
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          getNightShiftEvents(timezone);
        }}
      >
        get sample event night shift
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          getNightShiftEventsGrouped(timezone);
        }}
      >
        get sample event night shift grouped
      </button>
    </div>
  );
}
