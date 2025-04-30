"use client";

import { Button } from "@/components/ui/button";
import {
  createEvent,
  getAllEvents,
  getDayShiftEvents,
  getDayShiftEventsGrouped,
  getIdleTime,
  getNightShiftEvents,
  getNightShiftEventsGrouped,
  getTodayShiftEvents,
} from "@/services/events/eventsApi";
import { useTimeZone } from "@/stores/useMqttStore";
import { generateRandomPayload } from "@/lib/helper";

const Page = () => {
  const timezone = useTimeZone();
  return (
    <div className="p-6 mx-auto space-x-2 h-full">
      <h1 className="header">API Tester</h1>
      <div className="flex flex-wrap gap-2">
        <Button
          className="px-4 py-2"
          variant="outline"
          onClick={() => {
            createEvent(generateRandomPayload());
          }}
        >
          create sample event
        </Button>
        <Button
          className="px-4 py-2 "
          variant="outline"
          onClick={() => {
            getAllEvents();
          }}
        >
          get all event
        </Button>

        <Button
          className="px-4 py-2 "
          variant="outline"
          onClick={() => {
            getDayShiftEvents(timezone);
          }}
        >
          get sample event day shift
        </Button>
        <Button
          className="px-4 py-2 "
          variant="outline"
          onClick={() => {
            getDayShiftEventsGrouped(timezone);
          }}
        >
          get sample event day shift grouped
        </Button>
        <Button
          className="px-4 py-2 "
          variant="outline"
          onClick={() => {
            getNightShiftEvents(timezone);
          }}
        >
          get sample event night shift
        </Button>
        <Button
          className="px-4 py-2 "
          variant="outline"
          onClick={() => {
            getNightShiftEventsGrouped(timezone);
          }}
        >
          get sample event night shift grouped
        </Button>
        <Button
          className="px-4 py-2 "
          variant="outline"
          onClick={() => {
            getTodayShiftEvents(timezone);
          }}
        >
          get today events
        </Button>

        <Button
          className="px-4 py-2 "
          variant="outline"
          onClick={async () => {
            getIdleTime(timezone);
          }}
        >
          get idle time today
        </Button>
      </div>
    </div>
  );
};

export default Page;
