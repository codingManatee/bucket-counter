"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { FrigateEventMessage } from "@prisma/client";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const CumulativeChart = () => {
  const [chartData, setChartData] = useState([
    { hour: "7", count: 0 },
    { hour: "8", count: 0 },
    { hour: "9", count: 0 },
    { hour: "10", count: 0 },
    { hour: "11", count: 0 },
    { hour: "12", count: 0 },
    { hour: "13", count: 0 },
    { hour: "14", count: 0 },
    { hour: "15", count: 0 },
    { hour: "16", count: 0 },
    { hour: "17", count: 0 },
    { hour: "18", count: 0 },
    { hour: "19", count: 0 },
    { hour: "19", count: 0 },
    { hour: "20", count: 0 },
    { hour: "21", count: 0 },
    { hour: "22", count: 0 },
    { hour: "23", count: 0 },
    { hour: "0", count: 0 },
    { hour: "1", count: 0 },
    { hour: "2", count: 0 },
    { hour: "3", count: 0 },
    { hour: "4", count: 0 },
    { hour: "5", count: 0 },
    { hour: "6", count: 0 },
  ]);

  useEffect(() => {
    const fetchTodayShiftCount = async () => {
      try {
        const res = await fetch("/api/get-log?today=true");
        if (!res.ok) throw new Error("Failed to fetch");
        const events = await res.json();
        const hourOrder = [
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
        ];

        const hourCounts: Record<string, number> = {};
        hourOrder.forEach((hour) => {
          hourCounts[hour] = 0;
        });

        events.forEach((event: FrigateEventMessage) => {
          const eventDate = new Date(event.startTime * 1000);
          const hour = eventDate.getHours().toString();
          if (hour in hourCounts) {
            hourCounts[hour]++;
          }
        });

        let cumulative = 0;
        const cumulativeChartData = hourOrder.map((hour) => {
          cumulative += hourCounts[hour];
          return { hour, count: cumulative };
        });
        setChartData(cumulativeChartData);
      } catch (err) {
        console.error("Error fetching today shift count:", err);
      }
    };

    fetchTodayShiftCount();
  }, []);
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Showing cumulative count for today</CardTitle>
        <CardDescription>Area Chart</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="count"
              type="linear"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CumulativeChart;
