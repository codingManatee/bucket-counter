import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { FrigateEventMessage } from "@prisma/client";

const prisma = new PrismaClient();

type FrigateEventResponse = FrigateEventMessage[] | { error: string };

export async function GET(): Promise<NextResponse<FrigateEventResponse>> {
  try {
    const messages = await prisma.frigateEventMessage.findMany({
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json(
      { error: "Could not fetch logs: ", err },
      { status: 500 }
    );
  }
}
