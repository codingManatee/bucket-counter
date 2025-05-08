"use client";

import BucketCounter from "@/app/[locale]/dashboard/components/bucket-counter";
import DayChart from "@/app/[locale]/dashboard/components/dayChart";
import NightChart from "@/app/[locale]/dashboard/components/nightChart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const t = useTranslations("DashboardPage");

  return (
    <div className="p-5 h-full flex flex-col overflow-scroll">
      <div className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <div className="header">{t("header")}</div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  <ArrowLeft size={14} />
                  {t("returnToLog")}
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <BucketCounter />
            </div>
          </div>

          <div className="flex-1">
            <Tabs defaultValue="dayshift" className="h-full">
              <TabsList className="w-full">
                <TabsTrigger value="dayshift">{t("dayShift")}</TabsTrigger>
                <TabsTrigger value="nightshift">{t("nightShift")}</TabsTrigger>
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
    </div>
  );
};

export default Page;
