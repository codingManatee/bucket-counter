"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMqttConnection } from "@/hooks/useMqttConnection";
import {
  useIsConnected,
  useLogs,
  useMqttActions,
  useObjectCounts,
} from "@/stores/useMqttStore";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChartNoAxesCombined, RotateCcw, ScrollText, Wifi } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const logs = useLogs();
  const router = useRouter();

  const isConnected = useIsConnected();
  const objectCount = useObjectCounts();
  const { resetCounter, addLog, resetLog } = useMqttActions();

  // Connect to MQTT
  useMqttConnection("ws://localhost:9001", "frigate/reviews");

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 max-h-full overflow-auto">
      <div className="md:col-span-3 overflow-y-auto ">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-extrabold">
                Log Output
              </CardTitle>
              <div className="space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.push("/history");
                  }}
                >
                  <ScrollText size={14} />
                  History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                >
                  <ChartNoAxesCombined size={14} />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetLog();
                  }}
                >
                  <RotateCcw size={14} />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="overflow-scroll h-[calc(100vh-200px)] rounded-md border p-4 bg-slate-100 dark:bg-slate-800 font-mono text-sm">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="pb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic">
                  No log entries yet. Connect the system and press Start to
                  begin logging.
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
                  <div className="">Connection</div>
                  <Wifi size={14} className="ml-1" />
                </div>
              </CardTitle>
            </CardHeader>
            <Button
              className={`py-2 px-4 rounded-md text-center font-medium w-full ${
                isConnected
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-1">
          <CardHeader className=" flex flex-row items-center justify-between">
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 ">
            <div className="text-center">
              <div className="text-sm font-medium mb-1">COUNTER</div>
              <div className="text-6xl font-bold text-blue-600">
                {objectCount}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => {
                  addLog("Counter reset to 0");
                  resetCounter();
                }}
              >
                <RotateCcw size={14} className="mr-1" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
