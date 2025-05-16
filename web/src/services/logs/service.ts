import prisma from "@/lib/prisma";
import { LogService, CreateLogDto } from "./domain";

export const logService: LogService = {
  async getAllLogs() {
    return prisma.logMessage.findMany({ orderBy: { createdAt: "desc" } });
  },

  async createLog(dto: CreateLogDto) {
    return prisma.logMessage.create({
      data: dto,
    });
  },

  async deleteLog() {
    const [deletedLogs] = await prisma.$transaction([
      prisma.logMessage.findMany(),
      prisma.logMessage.deleteMany(),
    ]);
    return deletedLogs;
  },
};
