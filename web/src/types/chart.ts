import { FrigateEventMessage } from "@prisma/client";

export type ChartData = {
  time: string;
  bucketsPerPeriod: number;
  cumulativeTotal: number;
};

export type GroupedEvents = Record<string, FrigateEventMessage[]>;
