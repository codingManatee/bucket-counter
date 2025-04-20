import { eventService } from "@/services/events/events";
import { FrigateEventMessage } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const timezone = Number(searchParams.get("timezone")) || 0;
    const dayShiftEvents = (await eventService.getEventsDayShift(
      timezone,
      false
    )) as FrigateEventMessage[];
    const nightShiftEvents = (await eventService.getEventsNightShift(
      timezone,
      false
    )) as FrigateEventMessage[];
    return NextResponse.json([...dayShiftEvents, ...nightShiftEvents], {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}
