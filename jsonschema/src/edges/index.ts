import { Crossing } from "./crossing";
import { Footway } from "./footway";
import { Sidewalk } from "./sidewalk";
import { TrafficIsland } from "./traffic-island";

import { Steps } from "./steps";
import { Pedestrian } from "./pedestrian";

export type Edge =
  | Crossing
  | Footway
  | Sidewalk
  | TrafficIsland
  | Steps
  | Pedestrian;
