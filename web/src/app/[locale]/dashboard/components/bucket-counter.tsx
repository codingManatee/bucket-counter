"use client";

import {
  getDayShiftEvents,
  getNightShiftEvents,
} from "@/services/events/serviceApi";
import { useTimeZone } from "@/stores/useMqttStore";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

const BucketCounter = () => {
  const t = useTranslations("DashboardPage");
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
    <Card className="h-full">
      <CardContent className="h-full">
        <div className="flex flex-col h-full">
          {isLoading ? (
            <Skeleton className="w-24 h-8 mb-2" />
          ) : (
            <div className="text-3xl font-bold md:text-5xl lg:text-10xl">
              {dayCount + nightCount}
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            {t("totalBuckets")}
          </div>

          <div className="flex-1 w-full grid grid-cols-2 gap-2 mt-3 text-center">
            <div className="flex flex-col bg-amber-100 rounded-md p-2 justify-center">
              {isLoading ? (
                <>
                  <Skeleton className="w-10 h-6 mx-auto mb-1" />
                  <Skeleton className="w-16 h-3 mx-auto" />
                </>
              ) : (
                <>
                  <div className="text-lg font-medium md:text-4xl lg:text-7xl">
                    {dayCount}
                  </div>
                  <div className="text-xs text-amber-800 md:text-sm lg:text-xl">
                    {t("dayShift")}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col bg-indigo-100 rounded-md p-2 justify-center">
              {isLoading ? (
                <>
                  <Skeleton className="w-10 h-6 mx-auto mb-1" />
                  <Skeleton className="w-16 h-3 mx-auto" />
                </>
              ) : (
                <>
                  <div className="text-lg font-medium md:text-4xl lg:text-7xl">
                    {nightCount}
                  </div>
                  <div className="text-xs text-indigo-800 md:text-sm lg:text-xl">
                    {t("nightShift")}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BucketCounter;
