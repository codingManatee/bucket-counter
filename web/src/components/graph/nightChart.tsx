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
import { useTimeZone } from "@/stores/useMqttStore";
import { getNightShiftEventsGrouped } from "@/services/events/eventsApi";
import { transformGroupedEventsToChartData } from "@/utils/helper";

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
    const fetchAndTransform = async () => {
      const eventGrouped = await getNightShiftEventsGrouped(timezone);
      const data = transformGroupedEventsToChartData(eventGrouped, true);
      setChartData(data);
      setTotalCount(data.at(-1)?.cumulativeTotal ?? 0);
    };

    fetchAndTransform();
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
