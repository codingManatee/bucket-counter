"use client";

import BarGraph from "./barGraph";
import DailyCounter from "./dailyCounter";
import DayCounter from "./dayCounter";
import Graph from "./graph";
import NightCounter from "./nightCounter";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const Dashboard = () => {
  return (
    <Card className="col-span-1 md:col-span-4">
      <CardHeader>
        <CardTitle className="text-3xl font-extrabold">Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="grid-cols-1 grid md:grid-cols-4 gap-4">
        <DailyCounter />
        <DayCounter />
        <NightCounter />
        <BarGraph />
        <Graph />
      </CardContent>
    </Card>
  );
};

export default Dashboard;
