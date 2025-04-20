import { FrigateEventMessage } from "@prisma/client";
import { apiFetch } from "@/utils/apiFetch";
import { FrigateEvent } from "@/types/FrigateEvent";

type GroupedEvents = Record<string, FrigateEventMessage[]>;

export const getAllEvents = () =>
  apiFetch<FrigateEventMessage[]>("/api/events");

export const getTodayShiftEvents = (timezone: number) =>
  apiFetch<FrigateEventMessage[]>(`/api/events/today?timezone=${timezone}`);

export const getDayShiftEvents = (timezone: number) =>
  apiFetch<FrigateEventMessage[]>(`/api/events/day-shift?timezone=${timezone}`);

export const getNightShiftEvents = (timezone: number) =>
  apiFetch<FrigateEventMessage[]>(
    `/api/events/night-shift?timezone=${timezone}`
  );

export const getDayShiftEventsGrouped = (timezone: number) =>
  apiFetch<GroupedEvents>(`/api/events/day-shift-grouped?timezone=${timezone}`);

export const getNightShiftEventsGrouped = (timezone: number) =>
  apiFetch<GroupedEvents>(
    `/api/events/night-shift-grouped?timezone=${timezone}`
  );

export const createEvent = (event: FrigateEvent) =>
  apiFetch<FrigateEventMessage>("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });
