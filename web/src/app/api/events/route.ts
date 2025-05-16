import { eventService } from "@/services/events/service";
import { FrigateEvent } from "@/types/frigateEvent";

import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json(await eventService.getAllEvents());
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const event: FrigateEvent = await request.json();
    const createdEvent = eventService.createEvents(event);
    return NextResponse.json(createdEvent, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
