import { Feature, Polygon } from "geojson";

import { BasePolygonFields } from "./base-polygon-fields";
import {
  LeafCycle,
  LeafType,
  Name,
} from "fields";

/**
 * Fields that identify woods.
 */
interface WoodIdentifyingFields extends BasePolygonFields {
  natural: "wood";
}

/**
 * Fields that apply to woods.
 */
interface WoodFields extends WoodIdentifyingFields {
  name?: Name;
  leaf_type?: LeafType;
  leaf_cycle?: LeafCycle;
}

/**
 * Wood - tree-covered area.
 */
export type Wood = Feature<Polygon, WoodFields>;
