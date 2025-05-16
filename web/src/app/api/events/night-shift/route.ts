import { eventService } from "@/services/events/service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const timezone = Number(searchParams.get("timezone")) || 0;
    const dateParam = searchParams.get("date");
    let date: Date | undefined;
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (isNaN(parsed.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }
      date = parsed;
    }
    return NextResponse.json(
      await eventService.getEventsNightShift(timezone, false, date),
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}
