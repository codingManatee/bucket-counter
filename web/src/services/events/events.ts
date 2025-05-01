import prisma from "@/lib/prisma";
import { EventService } from "@/interfaces";
import { FrigateEvent } from "@/types/What";
import {
  startOfDay,
  addHours,
  format,
  getHours,
  isAfter,
  isBefore,
  setHours,
  subDays,
  addDays,
  differenceInSeconds,
  min as minDate,
  max as maxDate,
} from "date-fns";

export const eventService: EventService = {
  async getAllEvents() {
    return prisma.frigateEventMessage.findMany();
  },
  async getEventsDayShift(
    timezone: number,
    grouped = false,
    date?: string | Date
  ) {
    const events = await prisma.frigateEventMessage.findMany();
    const now = date ? new Date(date) : new Date();

    const localNow = addHours(now, timezone);

    let startLocal: Date;
    let endLocal: Date;

    if (getHours(localNow) < 7) {
      const yesterday = subDays(startOfDay(localNow), 1);
      startLocal = setHours(yesterday, 7);
      endLocal = setHours(yesterday, 19);
    } else {
      const today = startOfDay(localNow);
      startLocal = setHours(today, 7);
      endLocal = setHours(today, 19);
    }

    const startUTC = addHours(startLocal, -timezone);
    const endUTC = addHours(endLocal, -timezone);

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return isAfter(eventDate, startUTC) && isBefore(eventDate, endUTC);
    });

    if (!grouped) return filteredEvents;

    const groupedByHalfHour: Record<string, typeof filteredEvents> = {};

    for (let hour = 7; hour < 19; hour++) {
      groupedByHalfHour[`${hour.toString().padStart(2, "0")}:00`] = [];
      groupedByHalfHour[`${hour.toString().padStart(2, "0")}:30`] = [];
    }

    for (const event of filteredEvents) {
      const eventDate = addHours(new Date(event.startTime), timezone);
      const hour = format(eventDate, "HH");
      const minutes = eventDate.getMinutes();
      const bucket = minutes < 30 ? `${hour}:00` : `${hour}:30`;
      if (!groupedByHalfHour[bucket]) groupedByHalfHour[bucket] = [];
      groupedByHalfHour[bucket].push(event);
    }

    return groupedByHalfHour;
  },
  async getEventsNightShift(
    timezone: number,
    grouped = false,
    date?: string | Date
  ) {
    const events = await prisma.frigateEventMessage.findMany();
    const now = date ? new Date(date) : new Date();

    const localNow = addHours(now, timezone);

    let startLocal: Date;
    let endLocal: Date;

    if (getHours(localNow) < 7) {
      const today = startOfDay(localNow);
      const yesterday = subDays(today, 1);
      startLocal = setHours(yesterday, 19);
      endLocal = setHours(today, 7);
    } else {
      const today = startOfDay(localNow);
      const tomorrow = addDays(today, 1);
      startLocal = setHours(today, 19);
      endLocal = setHours(tomorrow, 7);
    }

    const startUTC = addHours(startLocal, -timezone);
    const endUTC = addHours(endLocal, -timezone);

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return isAfter(eventDate, startUTC) && isBefore(eventDate, endUTC);
    });

    if (!grouped) return filteredEvents;

    const groupedByHalfHour: Record<string, typeof filteredEvents> = {};

    for (let hour = 19; hour < 24; hour++) {
      groupedByHalfHour[`${hour.toString().padStart(2, "0")}:00`] = [];
      groupedByHalfHour[`${hour.toString().padStart(2, "0")}:30`] = [];
    }
    for (let hour = 0; hour < 7; hour++) {
      groupedByHalfHour[`${hour.toString().padStart(2, "0")}:00`] = [];
      groupedByHalfHour[`${hour.toString().padStart(2, "0")}:30`] = [];
    }

    for (const event of filteredEvents) {
      const eventDate = addHours(new Date(event.startTime), timezone);
      const hour = format(eventDate, "HH");
      const minutes = eventDate.getMinutes();
      const bucket = minutes < 30 ? `${hour}:00` : `${hour}:30`;
      if (!groupedByHalfHour[bucket]) groupedByHalfHour[bucket] = [];
      groupedByHalfHour[bucket].push(event);
    }

    return groupedByHalfHour;
  },
  async createEvents(event: FrigateEvent) {
    if (event.type !== "end") return;
    const eventData = event.after;
    const startTimeISO = new Date(eventData.start_time * 1000).toISOString();
    const endTimeISO = eventData.end_time
      ? new Date(eventData.end_time * 1000).toISOString()
      : null;

    return prisma.frigateEventMessage.create({
      data: {
        eventId: eventData.id,
        camera: eventData.camera,
        startTime: startTimeISO,
        endTime: endTimeISO || "",
        severity: eventData.severity,
        detections: {
          create: eventData.data.detections.map((detection) => ({
            value: detection,
          })),
        },
        zones: {
          create: eventData.data.zones.map((zone) => ({
            value: zone,
          })),
        },
        SubLabel: {
          create: eventData.data.sub_labels.map((subLabel) => ({
            value: subLabel,
          })),
        },
        Audio: {
          create: eventData.data.audio.map((audio) => ({
            value: audio,
          })),
        },
        ObjectLabel: {
          create: eventData.data.objects.map((object) => ({
            value: object,
          })),
        },
      },
    });
  },
  async getIdleTime(timezone: number, date?: string | Date) {
    const localNow = addHours(date ? new Date(date) : new Date(), timezone);

    // If before 7 AM local time, use the previous day's 7 AM as the start
    const isBefore7AM = getHours(localNow) < 7;

    const shiftStartLocal = setHours(
      isBefore7AM ? subDays(localNow, 1) : localNow,
      7
    );
    const shiftEndLocal = addDays(shiftStartLocal, 1);

    // Convert shift window back to UTC for querying
    const shiftStartUTC = addHours(shiftStartLocal, -timezone);
    const shiftEndUTC = addHours(shiftEndLocal, -timezone);

    const events = await prisma.frigateEventMessage.findMany({
      where: {
        AND: [
          { startTime: { lt: shiftEndUTC.toISOString() } },
          { endTime: { gt: shiftStartUTC.toISOString() } },
        ],
      },
      orderBy: { startTime: "asc" },
    });

    // Compute total active duration in the window
    const totalUsedSeconds = events.reduce((sum, event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);

      const clippedStart = maxDate([start, shiftStartUTC]);
      const clippedEnd = minDate([end, shiftEndUTC]);

      const duration = differenceInSeconds(clippedEnd, clippedStart);
      return sum + Math.max(0, duration);
    }, 0);

    const idleSeconds = 86400 - totalUsedSeconds;
    return Math.max(0, Math.round(idleSeconds));
  },
};
