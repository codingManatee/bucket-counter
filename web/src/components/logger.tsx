"use client";
import { ChartNoAxesCombined, RotateCcw, ScrollText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useLogs, useMqttActions } from "@/stores/useMqttStore";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Logger = () => {
  const logs = useLogs();
  const { resetLog } = useMqttActions();
  const router = useRouter();
  return (
    <div className="md:col-span-3 overflow-y-auto ">
      <Card className="">
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
        <CardContent className="">
          <ScrollArea className="overflow-scroll h-[calc(100vh-200px)] rounded-md border p-4 bg-slate-100 dark:bg-slate-800 font-mono text-sm">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="pb-1">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground italic">
                No log entries yet. Connect the system and press Start to begin
                logging.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logger;
