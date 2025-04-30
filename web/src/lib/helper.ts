import { ChartData, FrigateEvent } from "@/types/frigateEvent";
import { FrigateEventMessage } from "@prisma/client";

function sortTimeBuckets(times: string[], isNightShift = false): string[] {
  if (!isNightShift) {
    // Regular chronological sort
    return times.sort((a, b) => {
      const [ah, am] = a.split(":").map(Number);
      const [bh, bm] = b.split(":").map(Number);
      return ah !== bh ? ah - bh : am - bm;
    });
  }

  // Night shift custom order: 19:00 → 23:30, then 00:00 → 06:30
  return times.sort((a, b) => {
    const toNightIndex = (time: string) => {
      const [hour, min] = time.split(":").map(Number);
      let index = hour * 2 + (min >= 30 ? 1 : 0);
      // Shift 0-6:30 to be after 19-23:30
      if (hour < 7) index += 48; // 48 buckets = 24 hours * 2
      return index;
    };
    return toNightIndex(a) - toNightIndex(b);
  });
}

export function generateRandomPayload(): FrigateEvent {
  const getRandomItem = <T>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)];
  const getRandomString = () => Math.random().toString(36).substring(2, 10);
  const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const now = Math.floor(Date.now() / 1000);
  const startOffset = getRandomInt(-3600, 0);
  const duration = getRandomInt(5, 30);

  const id = `${now + startOffset}.${
    Math.random().toFixed(6).split(".")[1]
  }-${getRandomString()}`;
  const camera = getRandomItem(["main_cam", "garage", "driveway"]);
  const severity = getRandomItem(["info", "alert", "critical"]);

  return {
    type: "end",
    before: {
      id,
      camera,
      start_time: now,
      end_time: null,
      severity,
      thumb_path: `/media/frigate/clips/thumb-${camera}-${id}.webp`,
      data: {
        detections: ["det_" + getRandomString()],
        objects: ["person", "car", "dog"]
          .sort(() => 0.5 - Math.random())
          .slice(0, 1),
        sub_labels: [],
        zones: ["walking_zone", "entry", "garage_zone"]
          .sort(() => 0.5 - Math.random())
          .slice(0, 1),
        audio: [],
      },
    },
    after: {
      id,
      camera,
      start_time: now,
      end_time: now + duration,
      severity,
      thumb_path: `/media/frigate/clips/thumb-${camera}-${id}.webp`,
      data: {
        detections: ["det_" + getRandomString()],
        objects: ["person", "car", "dog"]
          .sort(() => 0.5 - Math.random())
          .slice(0, 1),
        sub_labels: [],
        zones: ["walking_zone", "entry", "garage_zone"]
          .sort(() => 0.5 - Math.random())
          .slice(0, 1),
        audio: [],
      },
    },
  };
}

export function transformGroupedEventsToChartData(
  grouped: Record<string, FrigateEventMessage[]>,
  isNightShift = false
): ChartData[] {
  const chartData: ChartData[] = [];
  let cumulativeTotal = 0;

  const sortedTimes = sortTimeBuckets(Object.keys(grouped), isNightShift);

  for (const time of sortedTimes) {
    const bucketsPerPeriod = grouped[time].length;
    cumulativeTotal += bucketsPerPeriod;

    chartData.push({
      time,
      bucketsPerPeriod,
      cumulativeTotal,
    });
  }

  return chartData;
}
