import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/services/events/events";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const timezone = Number(searchParams.get("timezone")) || 0;
    return NextResponse.json(
      await eventService.getEventsDayShift(timezone, false),
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}
