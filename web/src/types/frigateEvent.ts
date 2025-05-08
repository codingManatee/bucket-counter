export type FrigateEventType = "new" | "update" | "end";
export type FrigateSeverity = "detection" | "alert";

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
  severity: FrigateSeverity;
  thumb_path: string;
  data: {
    detections: string[];
    objects: string[];
    sub_labels: string[];
    zones: string[];
    audio: string[];
  };
};
