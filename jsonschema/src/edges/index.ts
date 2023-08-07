import { Crossing } from "./crossing";
import { Footway } from "./footway";
import { Sidewalk } from "./sidewalk";
import { TrafficIsland } from "./traffic-island";

import { Cycleway } from "./cycleway";

import { PrimaryStreet } from "./primary-street";
import { SecondaryStreet } from "./secondary-street";
import { TertiaryStreet } from "./tertiary-street";
import { ResidentialStreet } from "./residential-street";

import { ServiceRoad } from "./service-road";
import { Alley } from "./alley";
import { Driveway } from "./driveway";
import { ParkingAisle } from "./parking-aisle";
import { Steps } from "./steps";
import { Pedestrian } from "./pedestrian";

export type Edge =
  | Crossing
  | Footway
  | Sidewalk
  | TrafficIsland
  | Cycleway
  | PrimaryStreet
  | SecondaryStreet
  | TertiaryStreet
  | ResidentialStreet
  | ServiceRoad
  | Alley
  | Driveway
  | ParkingAisle
  | Steps
  | Pedestrian;
