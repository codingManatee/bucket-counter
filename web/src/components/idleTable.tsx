"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ShiftData {
  bucketsUnloaded: number;
  idleTime: string;
  completed: boolean;
}

interface BucketData {
  date: string;
  bucketsUnloaded: number;
  idleTime: string;
  completed: boolean;
  dayShift: ShiftData;
  nightShift: ShiftData;
}

const IdleTable = () => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (date: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const bucketData: BucketData[] = [
    {
      date: "01.04",
      bucketsUnloaded: 12,
      idleTime: "7h 20m",
      completed: true,
      dayShift: { bucketsUnloaded: 7, idleTime: "3h 45m", completed: true },
      nightShift: { bucketsUnloaded: 5, idleTime: "3h 35m", completed: true },
    },
    {
      date: "02.04",
      bucketsUnloaded: 13,
      idleTime: "7h 10m",
      completed: true,
      dayShift: { bucketsUnloaded: 8, idleTime: "3h 30m", completed: true },
      nightShift: { bucketsUnloaded: 5, idleTime: "3h 40m", completed: true },
    },
    {
      date: "03.04",
      bucketsUnloaded: 15,
      idleTime: "6h 40m",
      completed: true,
      dayShift: { bucketsUnloaded: 9, idleTime: "3h 10m", completed: true },
      nightShift: { bucketsUnloaded: 6, idleTime: "3h 30m", completed: true },
    },
    {
      date: "04.04",
      bucketsUnloaded: 14,
      idleTime: "6h 50m",
      completed: true,
      dayShift: { bucketsUnloaded: 8, idleTime: "3h 20m", completed: true },
      nightShift: { bucketsUnloaded: 6, idleTime: "3h 30m", completed: true },
    },
    {
      date: "05.04",
      bucketsUnloaded: 16,
      idleTime: "6h 25m",
      completed: true,
      dayShift: { bucketsUnloaded: 10, idleTime: "3h 05m", completed: true },
      nightShift: { bucketsUnloaded: 6, idleTime: "3h 20m", completed: true },
    },
    {
      date: "06.04",
      bucketsUnloaded: 13,
      idleTime: "7h 00m",
      completed: true,
      dayShift: { bucketsUnloaded: 7, idleTime: "3h 30m", completed: true },
      nightShift: { bucketsUnloaded: 6, idleTime: "3h 30m", completed: true },
    },
    {
      date: "07.04",
      bucketsUnloaded: 11,
      idleTime: "7h 45m",
      completed: true,
      dayShift: { bucketsUnloaded: 6, idleTime: "3h 55m", completed: true },
      nightShift: { bucketsUnloaded: 5, idleTime: "3h 50m", completed: true },
    },
  ];

  return (
    <Card className="w-full border shadow-sm h-full flex flex-col justify-between">
      <CardHeader className="shrink-0 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Bucket Unloading History
          </CardTitle>
          <Badge variant="outline" className="ml-2">
            Last 7 Days
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-full overflow-scroll grow h-full">
        <Table>
          <TableHeader className="">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px] font-medium">Date</TableHead>
              <TableHead className="font-medium">Buckets Unloaded</TableHead>
              <TableHead className="font-medium">Idle Time</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bucketData.map((row) => (
              <>
                <TableRow
                  key={row.date}
                  className={`hover:bg-muted/50 cursor-pointer ${
                    expandedRows[row.date] ? "bg-muted/30" : ""
                  }`}
                  onClick={() => toggleRow(row.date)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {expandedRows[row.date] ? (
                        <ChevronDown className="h-4 w-4 mr-2 text-slate-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2 text-slate-500" />
                      )}
                      {row.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {row.bucketsUnloaded} buckets
                      {row.completed && (
                        <div className="bg-green-500 rounded-sm p-0.5">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{row.idleTime}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // View details logic here
                      }}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows[row.date] && (
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableCell colSpan={4} className="p-0">
                      <div className="px-10 py-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border rounded-md p-3">
                            <div className="flex items-center mb-2">
                              <Sun className="h-4 w-4 mr-2 text-amber-500" />
                              <h4 className="font-medium">Day Shift</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-500">
                                  Buckets Unloaded:
                                </span>
                                <span className="font-medium flex items-center">
                                  {row.dayShift.bucketsUnloaded} buckets
                                  {row.dayShift.completed && (
                                    <div className="bg-green-500 rounded-sm p-0.5 ml-2">
                                      <Check className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">
                                  Idle Time:
                                </span>
                                <span className="font-medium">
                                  {row.dayShift.idleTime}
                                </span>
                              </div>
                              <div className="flex justify-end mt-2">
                                <Button variant="outline" size="sm">
                                  <Search className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="border rounded-md p-3">
                            <div className="flex items-center mb-2">
                              <Moon className="h-4 w-4 mr-2 text-indigo-500" />
                              <h4 className="font-medium">Night Shift</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-500">
                                  Buckets Unloaded:
                                </span>
                                <span className="font-medium flex items-center">
                                  {row.nightShift.bucketsUnloaded} buckets
                                  {row.nightShift.completed && (
                                    <div className="bg-green-500 rounded-sm p-0.5 ml-2">
                                      <Check className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">
                                  Idle Time:
                                </span>
                                <span className="font-medium">
                                  {row.nightShift.idleTime}
                                </span>
                              </div>
                              <div className="flex justify-end mt-2">
                                <Button variant="outline" size="sm">
                                  <Search className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="shrink-0 border-t p-0 ">
        <div className="flex items-center justify-end gap-2 p-3 border-t w-full">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-1" />
            View All Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default IdleTable;
