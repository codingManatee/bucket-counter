"use client";
import CounterBox from "@/components/counterBox";
import DayChart from "@/components/graph/dayChart";
import IdleTable from "@/components/idleTable";
import { Button } from "@/components/ui/button";
import {
  getDayShiftEvents,
  getNightShiftEvents,
} from "@/services/events/eventsApi";
import { useTimeZone } from "@/stores/useMqttStore";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
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
    <>
      <div className="p-5 h-full flex flex-col">
        <div className="flex justify-between">
          <div className="text-3xl font-extrabold pb-5">Dashboard</div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push("/");
              }}
            >
              <ArrowLeft size={14} />
              Return to Log
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 overflow-hidden">
          <div className="flex flex-col gap-4 overflow-auto">
            <div className="flex flex-col h-full max-h-full space-y-4 ">
              <div className="grid grid-cols-3 gap-4">
                <CounterBox
                  label="TODAY"
                  count={dayCount + nightCount}
                  isLoading={isLoading}
                />
                <CounterBox
                  label="DAY SHIFT"
                  description="7AM - 19PM"
                  count={dayCount}
                  numberColor="text-amber-500"
                  isLoading={isLoading}
                />
                <CounterBox
                  label="NIGHT SHIFT"
                  description="19PM - 7AM"
                  count={nightCount}
                  numberColor="text-indigo-600"
                  isLoading={isLoading}
                />
              </div>
              <div className="flex-1 h-full max-h-full overflow-hidden">
                <IdleTable />
              </div>
            </div>
          </div>
          <div className="flex flex-col overflow-auto">
            <DayChart isLoading={isLoading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
