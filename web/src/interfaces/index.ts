import { FrigateEvent } from "@/types/frigateEvent";
import { FrigateEventMessage } from "@prisma/client";

export interface EventService {
  getAllEvents: () => Promise<FrigateEventMessage[]>;
  getEventsDayShift: (
    timezone: number,
    grouped: boolean,
    date?: Date | string
  ) => Promise<FrigateEventMessage[] | Record<string, FrigateEventMessage[]>>;
  getEventsNightShift: (
    timezone: number,
    grouped: boolean,
    date?: Date | string
  ) => Promise<FrigateEventMessage[] | Record<string, FrigateEventMessage[]>>;
  createEvents: (
    event: FrigateEvent
  ) => Promise<FrigateEventMessage | undefined>;
  getIdleTime: (timezone: number, date?: Date | string) => Promise<number>;
}
