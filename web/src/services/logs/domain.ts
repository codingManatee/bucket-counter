import { LogMessage, Prisma } from "@prisma/client";

export type CreateLogDto = Prisma.LogMessageCreateInput;

export interface LogService {
  getAllLogs: () => Promise<LogMessage[]>;
  createLog: (dto: CreateLogDto) => Promise<LogMessage>;
  deleteLog: () => Promise<LogMessage[]>;
}
