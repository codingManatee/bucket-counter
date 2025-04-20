import { FrigateEventMessage } from "@prisma/client";

export type FrigateEventType = "new" | "update" | "end";

export type FrigateEvent = {
  type: FrigateEventType;
  before: FrigateReview;
  after: FrigateReview;
};

export type FrigateReview = {
  id: string;
  camera: string;
  start_time: number;
  end_time: number | null;
  severity: string;
  thumb_path: string;
  data: {
    detections: string[];
    objects: string[];
    sub_labels: string[];
    zones: string[];
    audio: string[];
  };
};

export type GroupedEvents = Record<string, FrigateEventMessage[]>;
