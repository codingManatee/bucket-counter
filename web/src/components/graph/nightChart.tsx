"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState, useEffect } from "react";
import { FrigateEventMessage } from "@prisma/client";
import { useTimeZone } from "@/stores/useMqttStore";

type chart_data = {
  time: string;
  bucketsPerPeriod: number;
  cumulativeTotal: number;
}[];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-sm">
        <p className="font-medium">{`Time: ${label}`}</p>
        <p className="text-sm text-green-700">{`Buckets in period: ${payload[0].value}`}</p>
        <p className="text-sm text-blue-700">{`Cumulative total: ${payload[1].value}`}</p>
      </div>
    );
  }

  return null;
};

const NightChart = () => {
  const [chartData, setChartData] = useState<chart_data>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const timezone = useTimeZone();

  useEffect(() => {
    const fetchDayShiftData = async () => {
      try {
        const res = await fetch(
          `/api/get-log?shift=night&timezone=${encodeURIComponent(timezone)}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const events = await res.json();

        const buckets: Record<string, number> = {};

        const startHour = 19;
        const endHour = 7;

        for (let i = 0; i < 24; i++) {
          const hour = (startHour + i) % 24;
          buckets[`${hour.toString().padStart(2, "0")}:00`] = 0;
          buckets[`${hour.toString().padStart(2, "0")}:30`] = 0;
          if (hour === (endHour - 1 + 24) % 24) break;
        }

        const timezoneOffset = timezone * 60;

        setTotalCount(events.length);

        events.forEach((event: FrigateEventMessage) => {
          const time = new Date(
            event.startTime * 1000 + timezoneOffset * 60 * 1000
          );
          const dateString = time
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

          const timePart = dateString.split(" ")[1];
          const [hourStr, minuteStr] = timePart.split(":");

          const hour = parseInt(hourStr, 10);
          const minutes = parseInt(minuteStr, 10);

          if (hour >= endHour || hour <= startHour) {
            const rounded = minutes < 30 ? "00" : "30";
            const key = `${hour.toString().padStart(2, "0")}:${rounded}`;
            if (key in buckets) {
              buckets[key]++;
            }
          }
        });

        let cumulative = 0;
        const chartData: chart_data = Object.entries(buckets)
          .sort(([a], [b]) => (a > b ? 1 : -1))
          .map(([time, count]) => {
            cumulative += count;
            return {
              time,
              bucketsPerPeriod: count,
              cumulativeTotal: cumulative,
            };
          });

        setChartData(chartData);
      } catch (err) {
        console.error("Error fetching day shift data:", err);
      }
    };

    fetchDayShiftData();
  }, [timezone]);

  return (
    <Card className="col-span-3 w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Night Shift Unloading Chart (19:00-7:00)
        </CardTitle>
        <CardDescription className="text-center text-base">
          Total: {totalCount} buckets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                label={{
                  value: "Time (HH:MM)",
                  position: "insideBottom",
                }}
                tick={{ fontSize: 12 }}
                height={50}
              />
              <YAxis
                label={{
                  value: "Number of Buckets",
                  angle: -90,
                  position: "insideLeft",
                }}
                tick={{ fontSize: 12 }}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingTop: "10px" }}
              />
              <Bar
                dataKey="bucketsPerPeriod"
                name="Buckets per 30 min"
                fill="#16a34a"
                barSize={20}
              />
              <Line
                type="monotone"
                dataKey="cumulativeTotal"
                name="Cumulative total"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NightChart;
