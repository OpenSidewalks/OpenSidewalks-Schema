import { Feature, Polygon } from "geojson";

import { BasePolygonFields } from "./base-polygon-fields";
import { BuildingField, Name, OpeningHours } from "../fields";

/**
 * Fields that identify a building.
 */
interface BuildingIdentifyingFields extends BasePolygonFields {
  building: BuildingField;
}

/**
 * Fields that apply to a building.
 */
interface BuildingFields extends BuildingIdentifyingFields {
  name?: Name;
  opening_hours?: OpeningHours;
}

/**
 * A building is a man-made structure with a roof, standing more or less permanently in one place.
 */
export type Building = Feature<Polygon, BuildingFields>;
