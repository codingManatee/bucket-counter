import { FrigateEvent } from "@/types/FrigateEvent";
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
}
