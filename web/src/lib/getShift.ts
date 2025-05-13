import { startOfDay, setHours, isAfter, isBefore } from "date-fns";

export const getShift = (date: Date): 1 | 2 => {
  const dayStart = startOfDay(new Date(date));
  const morningCutoff = setHours(dayStart, 8);
  const eveningCutoff = setHours(dayStart, 20);

  const isShift1 =
    isAfter(date, morningCutoff) && isBefore(date, eveningCutoff);
  return isShift1 ? 1 : 2;
};
