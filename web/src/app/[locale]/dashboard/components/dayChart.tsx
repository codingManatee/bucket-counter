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
} from "../../../../components/ui/card";
import { useEffect, useState } from "react";
import { getDayShiftEventsGrouped } from "@/services/events/eventsApi";
import { useTimeZone } from "@/stores/useMqttStore";
import { transformGroupedEventsToChartData } from "@/lib/helper";
import { Skeleton } from "../../../../components/ui/skeleton";
import { ChartData } from "@/types/chart";
import { useTranslations } from "next-intl";

const CustomTooltip = ({ active, payload, label }: any) => {
  const t = useTranslations("DashboardPage");
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-sm">
        <p className="font-medium">{`${t("tooltipTime")}: ${label}`}</p>
        <p className="text-sm text-green-700">{`${t("tooltipBuckets")}: ${
          payload[0].value
        }`}</p>
        <p className="text-sm text-blue-700">{`${t("tooltipCumulative")}: ${
          payload[1].value
        }`}</p>
      </div>
    );
  }

  return null;
};

interface DayChartProps {
  isLoading?: boolean;
}

const DayChart = ({ isLoading = false }: DayChartProps) => {
  const t = useTranslations("DashboardPage");
  const timezone = useTimeZone();
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchAndTransform = async () => {
      const eventGrouped = await getDayShiftEventsGrouped(timezone);
      const data = transformGroupedEventsToChartData(eventGrouped, false);
      setChartData(data);
    };

    fetchAndTransform();
  }, [timezone]);

  return (
    <Card className="h-full py-1">
      <CardHeader>
        <CardTitle className="text-center text-md md:text-xl">
          {t("dayChartTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="h-full w-full">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
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
                    value: t("xAxisLabel"),
                    position: "insideBottom",
                  }}
                  tick={{ fontSize: 12 }}
                  height={40}
                />
                <YAxis
                  label={{
                    value: t("yAxisLabel"),
                    angle: -90,
                    position: "insideLeft",
                  }}
                  tick={{ fontSize: 12 }}
                  width={35}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="bucketsPerPeriod"
                  name={t("bucketsPerPeriod")}
                  fill="#16a34a"
                  barSize={20}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeTotal"
                  name={t("cumulativeTotal")}
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DayChart;
