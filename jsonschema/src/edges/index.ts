import { Crossing } from "./crossing";
import { Footway } from "./footway";
import { Sidewalk } from "./sidewalk";
import { TrafficIsland } from "./traffic-island";
import { Steps } from "./steps";
import { Pedestrian } from "./pedestrian";

import { PrimaryStreet } from "./roads/primary-street";
import { SecondaryStreet } from "./roads/secondary-street";
import { TertiaryStreet } from "./roads/tertiary-street";
import { ResidentialStreet } from "./roads/residential-street";
import { ServiceRoad } from "./roads/service-road";
import { Alley } from "./roads/alley";
import { Driveway } from "./roads/driveway";
import { ParkingAisle } from "./roads/parking-aisle";
import { TrunkRoad } from "./roads/trunk-road";
import { UnclassifiedRoad } from "./roads/unclassified-road";
import { LivingStreet } from "./living-street";

export type Edge =
  | Crossing
  | Footway
  | Sidewalk
  | TrafficIsland
  | Steps
  | Pedestrian
  | PrimaryStreet
  | SecondaryStreet
  | TertiaryStreet
  | ResidentialStreet
  | ServiceRoad
  | Alley
  | Driveway
  | ParkingAisle
  | TrunkRoad
  | UnclassifiedRoad
  | LivingStreet;