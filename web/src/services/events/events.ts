import prisma from "@/lib/prisma";
import { EventService } from "@/interfaces";
import { FrigateEvent } from "@/types/FrigateEvent";

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

    const utcNow = new Date(now.getTime() + timezone * 60 * 60 * 1000);

    let startLocal: Date, endLocal: Date;

    if (utcNow.getHours() < 7) {
      const today = new Date(utcNow);
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      startLocal = new Date(yesterday.setHours(7, 0, 0, 0));
      endLocal = new Date(yesterday.setHours(19, 0, 0, 0));
    } else {
      const today = new Date(utcNow);
      today.setHours(0, 0, 0, 0);

      startLocal = new Date(today.setHours(7, 0, 0, 0));
      endLocal = new Date(today.setHours(19, 0, 0, 0));
    }

    const startUTC = new Date(startLocal.getTime() - timezone * 60 * 60 * 1000);
    const endUTC = new Date(endLocal.getTime() - timezone * 60 * 60 * 1000);

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate >= startUTC && eventDate < endUTC;
    });

    if (!grouped) return filteredEvents;

    const groupedByHalfHour: Record<string, typeof filteredEvents> = {};

    for (let hour = 7; hour < 19; hour++) {
      groupedByHalfHour[`${hour.toString().padStart(2, "0")}:00`] = [];
      groupedByHalfHour[`${hour.toString().padStart(2, "0")}:30`] = [];
    }

    for (const event of filteredEvents) {
      const date = new Date(event.startTime);
      let localHour = (date.getUTCHours() + timezone + 24) % 24;
      let localMinutes = date.getUTCMinutes();
      const hourStr = localHour.toString().padStart(2, "0");
      const bucket = localMinutes < 30 ? `${hourStr}:00` : `${hourStr}:30`;
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

    const utcNow = new Date(now.getTime() + timezone * 60 * 60 * 1000);

    let startLocal: Date, endLocal: Date;

    if (utcNow.getHours() < 7) {
      const today = new Date(utcNow);
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      startLocal = new Date(yesterday.setHours(19, 0, 0, 0));
      endLocal = new Date(today.setHours(7, 0, 0, 0));
    } else {
      const today = new Date(utcNow);
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      startLocal = new Date(today.setHours(19, 0, 0, 0));
      endLocal = new Date(tomorrow.setHours(7, 0, 0, 0));
    }

    const startUTC = new Date(startLocal.getTime() - timezone * 60 * 60 * 1000);
    const endUTC = new Date(endLocal.getTime() - timezone * 60 * 60 * 1000);

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate >= startUTC && eventDate < endUTC;
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
      const date = new Date(event.startTime);
      let localHour = (date.getUTCHours() + timezone + 24) % 24;
      let localMinutes = date.getUTCMinutes();
      const hourStr = localHour.toString().padStart(2, "0");
      const bucket = localMinutes < 30 ? `${hourStr}:00` : `${hourStr}:30`;
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
};
