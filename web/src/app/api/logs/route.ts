import { CreateLogDto } from "@/services/logs/domain";
import { logService } from "@/services/logs/service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const logs = await logService.getAllLogs();
    return NextResponse.json(logs);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const dto: CreateLogDto = await request.json();
    const createdLog = await logService.createLog(dto);
    return NextResponse.json(createdLog, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    const deletedLogs = await logService.deleteLog();
    // return the array of logs that were deleted
    return NextResponse.json(deletedLogs, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}
