"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMqttConnection } from "@/hooks/useMqttConnection";
import { getShift } from "@/lib/getShift";
import {
  getDayShiftEvents,
  getNightShiftEvents,
  resetCurrentShift,
} from "@/services/events/serviceApi";
import { createLog, getAllLogs, resetLog } from "@/services/logs/serviceApi";
import {
  useConnectionStatus,
  useLoggingStatus,
  useMqttActions,
  useTimeZone,
} from "@/stores/useMqttStore";
import { ConnectionStatus, LoggingStatus } from "@/types/mqttStore";
import { FrigateEventMessage, LogMessage } from "@prisma/client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  ChartNoAxesCombined,
  Play,
  RotateCcw,
  ScrollText,
  Square,
  Wifi,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const statusStyles: Record<ConnectionStatus, string> = {
  connected:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200",
  reconnecting:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200",
  disconnected:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200",
};

const loggingStyles: Record<LoggingStatus, string> = {
  hault: "bg-green-500 hover:bg-green-600",
  logging: "bg-red-400 hover:bg-red-500",
};

const Page = () => {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const loggingStatus = useLoggingStatus();
  const connectionStatus = useConnectionStatus();
  const timezone = useTimeZone();
  const { setLoggingStatus } = useMqttActions();
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<LogMessage[]>([]);

  const fetchCount = useCallback(async () => {
    const nowUtc = new Date();
    const isDayShift = getShift(nowUtc) === 1;

    try {
      const events: FrigateEventMessage[] = isDayShift
        ? await getDayShiftEvents(timezone)
        : await getNightShiftEvents(timezone);

      const log: LogMessage[] = await getAllLogs();

      setCount(events.length);
      setLogs(log);
    } catch (err) {
      console.error("failed to load events:", err);
      setCount(0);
    }
  }, [timezone]);

  useMqttConnection("frigate/reviews", fetchCount);

  const handleReset = async () => {
    await createLog({ message: "Reset current shift to 0" });
    setCount(0);
    await resetCurrentShift(timezone);
    await fetchCount();
  };

  const toggleLoggingStatus = () => {
    setLoggingStatus(loggingStatus === "logging" ? "hault" : "logging");
  };

  const handleResetLog = async () => {
    await resetLog();
    fetchCount();
  };

  useEffect(() => {
    fetchCount();
  }, [timezone]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 max-h-full overflow-auto">
      <div className="md:col-span-3 overflow-y-auto ">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
              <CardTitle className="text-3xl font-extrabold">
                {t("logOutput")}
              </CardTitle>
              <div className="space-x-2 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.push("/history");
                  }}
                >
                  <ScrollText size={14} />
                  {t("history")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                >
                  <ChartNoAxesCombined size={14} />
                  {t("dashboard")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleResetLog();
                  }}
                >
                  <RotateCcw size={14} />
                  {t("clear")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea
              className="overflow-scroll h-[calc(100vh-200px)] rounded-md border p-4 
                 bg-slate-100 dark:bg-slate-800 font-mono text-sm"
            >
              {loggingStatus === "hault" ? (
                <div className="space-y-2">{t("loggingHaulted")}</div>
              ) : logs.length > 0 ? (
                logs.map((log, idx) => {
                  const timeStr = new Date(log.createdAt).toLocaleTimeString();
                  const isFast = log.totalTime !== null && log.totalTime < 20;

                  return (
                    <div
                      key={idx}
                      className={`pb-1 ${isFast ? "text-red-500" : ""}`}
                    >
                      [{timeStr}] {log.message}
                    </div>
                  );
                })
              ) : (
                <div className="text-muted-foreground italic">
                  {t("noLogs")}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col space-y-3">
        <Card>
          <CardContent className="space-y-3">
            <CardHeader className="px-0">
              <CardTitle>
                <div className="flex flex-row justify-center items-center">
                  <div className="">{t("connection")}</div>
                  <Wifi size={14} className="ml-1" />
                </div>
              </CardTitle>
            </CardHeader>
            <Button
              className={`py-2 px-4 rounded-md text-center font-medium w-full ${statusStyles[connectionStatus]}`}
            >
              {t(connectionStatus)}
            </Button>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="space-y-6 h-full flex flex-1 flex-col justify-between">
            <div className="text-center">
              <div className="text-sm font-medium mb-1">{t("counter")}</div>
              <div className="text-6xl font-bold text-blue-600">{count}</div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={async () => {
                  handleReset();
                }}
              >
                <RotateCcw size={14} className="mr-1" />
                {t("resetShift")}
              </Button>
            </div>
            <div className="">
              <Button
                className={`w-full ${loggingStyles[loggingStatus]}`}
                onClick={toggleLoggingStatus}
              >
                {loggingStatus === "logging" ? (
                  <>
                    <Square size={16} className="mr-1.5" /> {t("stop")}
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-1.5" />
                    {t("start")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
