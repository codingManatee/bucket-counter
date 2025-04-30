"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import IdleTimeTable from "./components/idleTable";

const Page = () => {
  const router = useRouter();
  return (
    <div className="p-3 h-full">
      <div className="flex flex-row justify-between">
        <div className="header">Bucket Unloading History</div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
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
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <IdleTimeTable />
    </div>
  );
};

export default Page;
