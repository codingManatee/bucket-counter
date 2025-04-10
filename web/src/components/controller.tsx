"use client";
import { useMqttConnection } from "@/hooks/useMqttConnection";
import {
  useIsConnected,
  useIsLogging,
  useMqttActions,
  useObjectCounts,
} from "@/stores/useMqttStore";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ChartNoAxesColumn, Play, RotateCcw, Square } from "lucide-react";
import { Separator } from "./ui/separator";

const Controller = () => {
  const isLogging = useIsLogging();
  const isConnected = useIsConnected();
  const objectCount = useObjectCounts();
  const mqttUri = "ws://localhost:9001";
  const { resetCounter, setIsLogging, addLog } = useMqttActions();
  const { connect, disconnect } = useMqttConnection(mqttUri, "frigate/reviews");

  return (
    <>
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader className=" flex flex-row items-center justify-between">
            <CardTitle>Status</CardTitle>
            <Button variant="outline" size="icon">
              <ChartNoAxesColumn />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div>
              <div className="text-sm font-medium mb-2">CONNECTION</div>
              <Button
                className={`py-2 px-4 rounded-md text-center font-medium w-full ${
                  isConnected
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200"
                }`}
                onClick={() => {
                  if (isConnected) {
                    disconnect();
                  } else {
                    connect();
                  }
                }}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </Button>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">LOGGING</div>
              <div
                className={`py-2 px-4 rounded-md text-center font-medium ${
                  isLogging
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {isLogging ? "Running" : "Stopped"}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 h-full justify-end">
            <Separator />
            <Button
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={() => {
                addLog("Logging started");
                setIsLogging(true);
              }}
              disabled={isLogging || !isConnected}
            >
              <Play size={16} className="mr-1.5" />
              Start
            </Button>
            <Button
              className="w-full bg-red-400 hover:bg-red-500"
              onClick={() => {
                addLog("Logging stopped");
                setIsLogging(false);
              }}
              disabled={!isLogging}
            >
              <Square size={16} className="mr-1.5" />
              Stop
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Controller;
