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
import { Driveway } from "./driveway";

export type Pathway =
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
  | Driveway;
