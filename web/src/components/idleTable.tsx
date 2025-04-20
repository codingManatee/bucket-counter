import { Check, ChevronLeft, Download, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BucketData {
  date: string;
  bucketsUnloaded: number;
  idleTime: string;
  completed: boolean;
}

const IdleTable = () => {
  const bucketData: BucketData[] = [
    { date: "01.04", bucketsUnloaded: 12, idleTime: "7h 20m", completed: true },
    { date: "02.04", bucketsUnloaded: 13, idleTime: "7h 10m", completed: true },
    { date: "03.04", bucketsUnloaded: 15, idleTime: "6h 40m", completed: true },
    { date: "04.04", bucketsUnloaded: 14, idleTime: "6h 50m", completed: true },
    { date: "05.04", bucketsUnloaded: 16, idleTime: "6h 25m", completed: true },
    { date: "06.04", bucketsUnloaded: 13, idleTime: "7h 00m", completed: true },
    { date: "07.04", bucketsUnloaded: 11, idleTime: "7h 45m", completed: true },
  ];

  return (
    <Card className="col-span-3 w-full border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">
          Bucket Unloading History - Last 7 Days (as of April 8)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px] font-medium">Date</TableHead>
              <TableHead className="font-medium">Buckets Unloaded</TableHead>
              <TableHead className="font-medium">Idle Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bucketData.map((row) => (
              <TableRow key={row.date} className="hover:bg-muted/50">
                <TableCell className="font-medium">{row.date}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-start gap-2 p-3 border-t">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="ml-auto">
            <Search className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdleTable;
