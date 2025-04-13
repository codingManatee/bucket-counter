"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useEffect, useState } from "react";

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function getCurrentWeekRange(): [number, number] {
  const now = new Date();
  const day = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - day);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return [
    Math.floor(startOfWeek.getTime() / 1000),
    Math.floor(endOfWeek.getTime() / 1000),
  ];
}

const BarGraph = () => {
  const [chartData, setChartData] = useState<
    { dayOfTheWeek: string; count: number }[]
  >([]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      const [start, end] = getCurrentWeekRange();
      try {
        const res = await fetch(`/api/get-log?start=${start}&end=${end}`);
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        const countByDay: Record<string, number> = {
          Sunday: 0,
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
        };
        for (const event of data) {
          const date = new Date(event.startTime * 1000);
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "long",
          });
          countByDay[dayName]++;
        }
        const formatted = Object.entries(countByDay).map(([day, count]) => ({
          dayOfTheWeek: day,
          count,
        }));
        setChartData(formatted);
      } catch (err) {
        console.error("Failed to fetch weekly event data:", err);
      }
    };

    fetchWeeklyData();
  }, []);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Count Per Day</CardTitle>
        <CardDescription>This Week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dayOfTheWeek"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="oklch(70.5% 0.213 47.604)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
export default BarGraph;
