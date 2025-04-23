"use client";

import BucketCounter from "@/components/bucket-counter";
import DayChart from "@/components/graph/dayChart";
import NightChart from "@/components/graph/nightChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BucketData {
  total: number;
  dayShift: number;
  nightShift: number;
}

const Page = () => {
  const router = useRouter();

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="overflow-auto md:flex-1 md:min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full overflow-auto">
          <div className="">
            <div className="flex flex-row justify-between items-center">
              <div className="header">Dashboard</div>
              <div className="space-x-2">
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
            <BucketCounter />
          </div>

          <Tabs defaultValue="dayshift">
            <TabsList className="w-full">
              <TabsTrigger value="dayshift">Day shift</TabsTrigger>
              <TabsTrigger value="nightshift">Night Shift</TabsTrigger>
            </TabsList>
            <TabsContent value="dayshift">
              <DayChart isLoading={false} />
            </TabsContent>
            <TabsContent value="nightshift">
              <NightChart />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
