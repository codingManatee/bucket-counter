import { NextResponse } from "next/server";
import { PrismaClient, FrigateEventMessage } from "@prisma/client";

const prisma = new PrismaClient();

type FrigateEventResponse = FrigateEventMessage[] | { error: string };

export async function GET(
  request: Request
): Promise<NextResponse<FrigateEventResponse>> {
  const { searchParams } = new URL(request.url);

  const isToday = searchParams.get("today") === "true";
  const shift = searchParams.get("shift");
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");

  let startTime: number | null = null;
  let endTime: number | null = null;

  try {
    const now = new Date();

    if (shift === "day") {
      const start = new Date(now);
      start.setHours(7, 0, 0, 0);
      const end = new Date(now);
      end.setHours(19, 0, 0, 0);

      startTime = Math.floor(start.getTime() / 1000);
      endTime = Math.floor(end.getTime() / 1000);
    } else if (shift === "night") {
      const start = new Date(now);
      start.setHours(19, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1); // next day
      end.setHours(7, 0, 0, 0);

      startTime = Math.floor(start.getTime() / 1000);
      endTime = Math.floor(end.getTime() / 1000);
    } else if (isToday) {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);

      startTime = Math.floor(start.getTime() / 1000);
      endTime = Math.floor(end.getTime() / 1000);
    } else if (startParam && endParam) {
      startTime = parseInt(startParam);
      endTime = parseInt(endParam);

      if (isNaN(startTime) || isNaN(endTime)) {
        return NextResponse.json(
          { error: "'start' and 'end' must be valid timestamps" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Missing time range parameters" },
        { status: 400 }
      );
    }

    const messages = await prisma.frigateEventMessage.findMany({
      where: {
        startTime: {
          gte: startTime,
          lte: endTime,
        },
      },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not fetch logs" },
      { status: 500 }
    );
  }
}
