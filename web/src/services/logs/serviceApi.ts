import { LogMessage } from "@prisma/client";
import { apiFetch } from "@/lib/apiFetch";
import { CreateLogDto } from "./domain";

export const getAllLogs = () => apiFetch<LogMessage[]>("/api/logs");

export const createLog = (dto: CreateLogDto) =>
  apiFetch<LogMessage>("/api/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

export const resetLog = () =>
  apiFetch<number>("/api/logs", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
