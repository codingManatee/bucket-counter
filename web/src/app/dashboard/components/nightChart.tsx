"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useState, useEffect } from "react";
import { useTimeZone } from "@/stores/useMqttStore";
import { getNightShiftEventsGrouped } from "@/services/events/eventsApi";
import { transformGroupedEventsToChartData } from "@/lib/helper";
import { ChartData } from "@/types/chart";

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
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const timezone = useTimeZone();

  useEffect(() => {
    const fetchAndTransform = async () => {
      const eventGrouped = await getNightShiftEventsGrouped(timezone);
      const data = transformGroupedEventsToChartData(eventGrouped, true);
      setChartData(data);
    };

    fetchAndTransform();
  }, [timezone]);

  return (
    <Card className="h-full py-1">
      <CardHeader>
        <CardTitle className="text-center text-md md:text-xl">
          Night Shift Unloading Chart
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="h-full w-full">
          <ResponsiveContainer>
            <ComposedChart
              data={chartData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
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
