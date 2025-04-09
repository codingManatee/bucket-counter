import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const messages = await prisma.frigateEventMessage.findMany({
      orderBy: { startTime: "desc" },
      include: {
        detections: true,
        objects: true,
        subLabels: true,
        zones: true,
        audio: true,
      },
    });

    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json(
      { error: "Could not fetch logs" },
      { status: 500 }
    );
  }
}
