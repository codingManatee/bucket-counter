"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useTimeZone } from "@/stores/useMqttStore";
import { getIdleTime, getTodayShiftEvents } from "@/services/events/eventsApi";
import { Card } from "@/components/ui/card";

type tableData = {
  date: string;
  counts: number;
  idleSeconds: number;
};

function formatSeconds(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs > 0 && mins > 0) return `${hrs}H ${mins}m`;
  if (hrs > 0) return `${hrs}H`;
  return `${mins}m`;
}

const IdleTimeTable = () => {
  const timezone = useTimeZone();
  const [data, setData] = useState<tableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchIdleTimes = async () => {
      try {
        setIsLoading(true);
        const results: tableData[] = [];

        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          d.setHours(0, 0, 0, 0);

          const isoDate = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
          const idleTime = await getIdleTime(timezone, isoDate);
          const count = (await getTodayShiftEvents(timezone, isoDate)).length;
          results.push({ date: isoDate, counts: count, idleSeconds: idleTime });
        }

        setData(results.reverse()); // reverse to make it oldest to newest
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdleTimes();
  }, [timezone]);

  return (
    <Card className="flex flex-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Buckets Unloaded</TableHead>
            <TableHead>Idle Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.date}>
              <TableCell>{format(new Date(row.date), "yyyy-MM-dd")}</TableCell>
              <TableCell>{row.counts}</TableCell>
              <TableCell>{formatSeconds(row.idleSeconds)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default IdleTimeTable;
