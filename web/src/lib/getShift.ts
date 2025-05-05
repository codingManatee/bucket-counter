import { ShiftDisplay } from "@/enums/mqttStore";

export const getShift = (date: Date, tzOffsetHrs: number): ShiftDisplay => {
  const local = new Date(date.getTime() + tzOffsetHrs * 60 * 60 * 1000);
  const h = local.getHours();
  return h >= 8 && h < 20 ? ShiftDisplay.DAY : ShiftDisplay.NIGHT;
};
