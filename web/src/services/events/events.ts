import prisma from "@/lib/prisma";
import { EventService } from "@/interfaces";

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
import { FrigateEvent } from "@/types/frigateEvent";

const SHIFT_CONFIG = {
  start: 8,
  end: 20,
};

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

    if (getHours(localNow) < SHIFT_CONFIG.start) {
      const yesterday = subDays(startOfDay(localNow), 1);
      startLocal = setHours(yesterday, SHIFT_CONFIG.start);
      endLocal = setHours(yesterday, SHIFT_CONFIG.end);
    } else {
      const today = startOfDay(localNow);
      startLocal = setHours(today, SHIFT_CONFIG.start);
      endLocal = setHours(today, SHIFT_CONFIG.end);
    }

    const startUTC = addHours(startLocal, -timezone);
    const endUTC = addHours(endLocal, -timezone);

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return isAfter(eventDate, startUTC) && isBefore(eventDate, endUTC);
    });

    if (!grouped) return filteredEvents;

    const groupedByHalfHour: Record<string, typeof filteredEvents> = {};

    for (let hour = SHIFT_CONFIG.start; hour < SHIFT_CONFIG.end; hour++) {
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

    if (getHours(localNow) < SHIFT_CONFIG.start) {
      const today = startOfDay(localNow);
      const yesterday = subDays(today, 1);
      startLocal = setHours(yesterday, SHIFT_CONFIG.end);
      endLocal = setHours(today, SHIFT_CONFIG.start);
    } else {
      const today = startOfDay(localNow);
      const tomorrow = addDays(today, 1);
      startLocal = setHours(today, SHIFT_CONFIG.end);
      endLocal = setHours(tomorrow, SHIFT_CONFIG.start);
    }

    const startUTC = addHours(startLocal, -timezone);
    const endUTC = addHours(endLocal, -timezone);

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return isAfter(eventDate, startUTC) && isBefore(eventDate, endUTC);
    });

    if (!grouped) return filteredEvents;

    const groupedByHalfHour: Record<string, typeof filteredEvents> = {};

    for (let hour = SHIFT_CONFIG.end; hour < 24; hour++) {
      groupedByHalfHour[`${hour.toString().padStart(2, "0")}:00`] = [];
      groupedByHalfHour[`${hour.toString().padStart(2, "0")}:30`] = [];
    }
    for (let hour = 0; hour < SHIFT_CONFIG.start; hour++) {
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

    const isBeforeShiftStart = getHours(localNow) < SHIFT_CONFIG.start;

    const shiftStartLocal = setHours(
      isBeforeShiftStart ? subDays(localNow, 1) : localNow,
      SHIFT_CONFIG.start
    );
    const shiftEndLocal = addDays(shiftStartLocal, 1);

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
  async resetCurrentShift(timezone: number, date?: string | Date) {
    // 1 — figure out "now" in the plant’s local time
    const localNow = addHours(date ? new Date(date) : new Date(), timezone);
    const hour = getHours(localNow);

    let shiftStartLocal: Date;
    let shiftEndLocal: Date;

    if (hour >= SHIFT_CONFIG.start && hour < SHIFT_CONFIG.end) {
      // DAY shift (08 – 20 local)
      const today = startOfDay(localNow);
      shiftStartLocal = setHours(today, SHIFT_CONFIG.start); // 08:00 today
      shiftEndLocal = setHours(today, SHIFT_CONFIG.end); // 20:00 today
    } else if (hour >= SHIFT_CONFIG.end) {
      // NIGHT shift, first half (20 – 24 local)
      const today = startOfDay(localNow);
      shiftStartLocal = setHours(today, SHIFT_CONFIG.end); // 20:00 today
      shiftEndLocal = addDays(today, 1); // 00:00 tomorrow
    } else {
      // NIGHT shift, second half (00 – 08 local)
      const today = startOfDay(localNow);
      const yesterday = subDays(today, 1);
      shiftStartLocal = setHours(yesterday, SHIFT_CONFIG.end); // 20:00 yesterday
      shiftEndLocal = setHours(today, SHIFT_CONFIG.start); // 08:00 today
    }

    // 2 — convert to UTC
    const shiftStartUTC = addHours(shiftStartLocal, -timezone);
    const shiftEndUTC = addHours(shiftEndLocal, -timezone);

    // 3 — delete everything whose *start* falls inside the current shift
    const { count } = await prisma.frigateEventMessage.deleteMany({
      where: {
        startTime: {
          gte: shiftStartUTC.toISOString(),
          lt: shiftEndUTC.toISOString(),
        },
      },
    });

    return count; // optional: return how many rows were purged
  },
};
