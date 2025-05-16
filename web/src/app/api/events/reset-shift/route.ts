import { eventService } from "@/services/events/service";
import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/reset-shift?timezone=<hours>&date=<ISO8601>
 *
 * • timezone – offset from UTC in hours (default 0)
 * • date      – (optional) ISO-8601 string used as the “current” time
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    const timezone = Number(searchParams.get("timezone")) || 0;

    const dateParam = searchParams.get("date");
    let date: Date | undefined;
    if (dateParam) {
      date = new Date(dateParam);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }
    }

    const deleted = await eventService.resetCurrentShift(timezone, date);

    return NextResponse.json(
      {
        message: "Current shift events deleted",
        deletedCount: deleted,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
