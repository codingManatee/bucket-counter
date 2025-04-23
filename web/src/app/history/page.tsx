import IdleTimeTable from "@/components/idleTable";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

const data = [
  { date: "2025-04-21", idleSeconds: 66600 },
  { date: "2025-04-22", idleSeconds: 72000 },
];

const Page = () => {
  return (
    <div className="p-3 h-full">
      <div className="flex flex-row justify-between">
        <div className="header">History</div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      <IdleTimeTable data={data} />
    </div>
  );
};

export default Page;
