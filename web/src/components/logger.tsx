import { ScrollArea } from "@radix-ui/react-scroll-area";
import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useLogs, useMqttActions } from "@/stores/useMqttStore";

const Logger = () => {
  const logs = useLogs();
  const { resetLog } = useMqttActions();
  return (
    <div className="md:col-span-3 h-full ">
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-extrabold">
              Log Output
            </CardTitle>
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
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)] rounded-md border p-4 bg-slate-100 dark:bg-slate-800 font-mono text-sm">
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
