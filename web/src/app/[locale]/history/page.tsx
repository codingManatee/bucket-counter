"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format, getDaysInMonth, isFuture, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MonthPicker } from "@/components/ui/monthpicker";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getDayShiftEvents,
  getNightShiftEvents,
  getIdleTime,
} from "@/services/events/serviceApi";
import { useTimeZone } from "@/stores/useMqttStore";
import { Skeleton } from "@/components/ui/skeleton";

type BucketData = {
  date: string;
  dayShift: number;
  nightShift: number;
  total: number;
  idleTime: string;
};

const formatIdleTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}H${minutes > 0 ? ` ${minutes}M` : ""}${
    remainingSeconds > 0 ? ` ${remainingSeconds}S` : ""
  }`;
};

const Page = () => {
  const t = useTranslations("HistoryPage");
  const [date, setDate] = useState<Date>(new Date());
  const [bucketData, setBucketData] = useState<BucketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const timezone = useTimeZone();

  const handleExport = (
    data: BucketData[],
    filename = `bucket-report-${format(date, "yyyy-MM")}.csv`
  ) => {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`)
        .join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchBucketData = async () => {
      const daysInMonth = getDaysInMonth(date);
      const startDate = startOfMonth(date);
      const results: BucketData[] = [];

      for (let i = 0; i < daysInMonth; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        const dateStr = format(currentDate, "yyyy-MM-dd");

        try {
          setIsLoading(true);
          const [dayShift, nightShift, idle] = await Promise.all([
            getDayShiftEvents(timezone, dateStr),
            getNightShiftEvents(timezone, dateStr),
            getIdleTime(timezone, dateStr),
          ]);

          results.push({
            date: dateStr,
            dayShift: dayShift.length,
            nightShift: nightShift.length,
            total: dayShift.length + nightShift.length,
            idleTime: isFuture(currentDate) ? "No Data" : formatIdleTime(idle),
          });
        } catch (err) {
          console.error("Failed on", dateStr, err);
        } finally {
          setIsLoading(false);
        }
      }

      setBucketData(results);
    };

    fetchBucketData();
  }, [timezone, date]);

  return (
    <div className="p-4 w-full h-full">
      <Card className="border-0 shadow-sm h-full">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold">{t("title")}</CardTitle>
              <p className="text-muted-foreground">
                {t("subtitle", { month: format(date, "MMMM yyyy") })}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMM yyyy") : t("pickMonth")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <MonthPicker onMonthSelect={setDate} selectedMonth={date} />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                onClick={() => {
                  if (!isLoading) {
                    handleExport(bucketData);
                  }
                }}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {t("export")}
              </Button>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => router.push("/")}
              >
                <ChevronLeft className="h-4 w-4" />
                {t("returnToLog")}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-scroll">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">{t("date")}</TableHead>
                  <TableHead className="text-center">{t("dayShift")}</TableHead>
                  <TableHead className="text-center">
                    {t("nightShift")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("totalBuckets")}
                  </TableHead>
                  <TableHead className="text-right">{t("idleTime")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading
                  ? Array(30)
                      .fill(0)
                      .map((_, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                        </TableRow>
                      ))
                  : bucketData.map((row) => (
                      <TableRow key={row.date}>
                        <TableCell>
                          {format(new Date(row.date), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.dayShift}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.nightShift}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {row.total}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.idleTime}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
