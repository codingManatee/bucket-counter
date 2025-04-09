import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id: eventId,
      camera,
      start_time: startTime,
      end_time: endTime,
      severity,
      thumb_path: thumbPath,
      data: { detections, objects, sub_labels: subLabels, zones, audio },
    } = body.after;

    await prisma.frigateEventMessage.create({
      data: {
        eventId,
        camera,
        startTime,
        endTime,
        severity,
        thumbPath,
        detections: {
          create: detections.map((value: string) => ({ value })),
        },
        objects: {
          create: objects.map((value: string) => ({ value })),
        },
        subLabels: {
          create: subLabels.map((value: string) => ({ value })),
        },
        zones: {
          create: zones.map((value: string) => ({ value })),
        },
        audio: {
          create: audio.map((value: string) => ({ value })),
        },
      },
    });
  } catch (err) {
    console.error("Error saving event log:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
