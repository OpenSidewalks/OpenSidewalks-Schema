import { Building } from "./building";
import { Wood } from "./wood";
import { PublicTransportShelterPolygon } from "./public-transport-shelter";

export type Polygon =
  | Building
  | Wood
  | PublicTransportShelterPolygon;
