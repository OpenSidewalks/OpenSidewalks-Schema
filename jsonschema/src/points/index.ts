// Points are geospatial point features that are not explicitly associated with
// the graph. They are still of interest to pedestrian datasets, however, and
// may be queried relative to the graph using spatial relationships, e.g.
// "all fire hydrants within 3 meters of this sidewalk".

import { FireHydrant } from "./fire-hydrant";
import { PowerPole } from "./power-pole";
import { Bench } from "./bench";
import { WasteBasket } from "./waste-basket";
import { Manhole } from "./manhole";
import { Bollard } from "./bollard";
import { StreetLamp } from "./street-lamp";
import { Tree } from "./tree";
import { BicycleParking } from "./bicycle-parking";
import { StreetCabinet } from "./street-cabinet";
import { PublicTransportShelterPoint } from "./public-transport-shelter";

export type Point =
  | BicycleParking
  | FireHydrant
  | PowerPole
  | Bench
  | WasteBasket
  | Manhole
  | Bollard
  | StreetLamp
  | StreetCabinet
  | PublicTransportShelterPoint
  | Tree;
