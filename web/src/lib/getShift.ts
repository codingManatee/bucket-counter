import { addHours, startOfDay, setHours, isAfter, isBefore } from "date-fns";

export const getShift = (date: Date, timezone: number): 1 | 2 => {
  const nowLocal = addHours(date, timezone);

  // 3) build our shift cutoffs (today at 08:00 & 20:00)
  const dayStart = startOfDay(new Date(nowLocal));
  const morningCutoff = setHours(dayStart, 8);
  const eveningCutoff = setHours(dayStart, 20);

  // 4) decide which shift we're in
  const isShift1 =
    isAfter(nowLocal, morningCutoff) && isBefore(nowLocal, eveningCutoff);
  return isShift1 ? 1 : 2;
};
