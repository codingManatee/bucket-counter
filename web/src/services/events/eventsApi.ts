import { FrigateEventMessage } from "@prisma/client";
import { apiFetch } from "@/utils/apiFetch";
import { FrigateEvent } from "@/types/FrigateEvent";

type GroupedEvents = Record<string, FrigateEventMessage[]>;

export const getAllEvents = () =>
  apiFetch<FrigateEventMessage[]>("/api/events");

export const getTodayShiftEvents = (timezone: number, date?: string) =>
  apiFetch<FrigateEventMessage[]>(
    `/api/events/today?timezone=${timezone}` + (date ? `&date=${date}` : "")
  );

export const getDayShiftEvents = (timezone: number, date?: string) =>
  apiFetch<FrigateEventMessage[]>(
    `/api/events/day-shift?timezone=${timezone}` + (date ? `&date=${date}` : "")
  );

export const getNightShiftEvents = (timezone: number, date?: string) =>
  apiFetch<FrigateEventMessage[]>(
    `/api/events/night-shift?timezone=${timezone}` +
      (date ? `&date=${date}` : "")
  );

export const getDayShiftEventsGrouped = (timezone: number, date?: string) =>
  apiFetch<GroupedEvents>(
    `/api/events/day-shift-grouped?timezone=${timezone}` +
      (date ? `&date=${date}` : "")
  );

export const getNightShiftEventsGrouped = (timezone: number, date?: string) =>
  apiFetch<GroupedEvents>(
    `/api/events/night-shift-grouped?timezone=${timezone}` +
      (date ? `&date=${date}` : "")
  );

export const createEvent = (event: FrigateEvent) =>
  apiFetch<FrigateEventMessage>("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

export const getIdleTime = (timezone: number, date?: string) =>
  apiFetch<number>(
    `/api/events/idle-time?timezone=${timezone}` + (date ? `&date=${date}` : "")
  );
