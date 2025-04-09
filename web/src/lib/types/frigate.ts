export interface FrigateEventMessage {
  type: "new" | "update" | "end";
  before: FrigateObject;
  after: FrigateObject;
}

export interface FrigateObject {
  id: string;
  camera: string;
  frame_time: number;
  snapshot?: {
    frame_time: number;
    box: number[];
    area: number;
    region: number[];
    score: number;
    attributes: any[];
  };
  label: string;
  sub_label: [string, number] | null;
  top_score: number;
  false_positive: boolean;
  start_time: number;
  end_time: number | null;
  score: number;
  box: number[];
  area: number;
  ratio: number;
  region: number[];
  current_zones: string[];
  entered_zones: string[];
  thumbnail: string | null;
  has_snapshot: boolean;
  has_clip: boolean;
  active: boolean;
  stationary: boolean;
  motionless_count: number;
  position_changes: number;
  attributes: Record<string, number>;
  current_attributes: {
    label: string;
    box: number[];
    score: number;
  }[];
}
