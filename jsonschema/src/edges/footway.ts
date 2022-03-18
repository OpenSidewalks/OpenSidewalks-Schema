import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import {
  Brunnel,
  Description,
  Incline,
  Layer,
  Length,
  Name,
  Surface,
  Width,
} from "../fields";

/**
 * Fields that identify a footway.
 */
interface FootwayIdentifyingFields extends BaseEdgeFields {
  highway: "footway";
}

/**
 * Fields that apply to a footway.
 */
export interface FootwayFields extends FootwayIdentifyingFields {
  brunnel?: Brunnel;
  description?: Description;
  incline?: Incline;
  layer?: Layer;
  length?: Length;
  name?: Name;
  surface?: Surface;
  width?: Width;
}

/**
 * The centerline of a dedicated pedestrian pathway that does not fall into any other subcategories.
 */
export type Footway = Feature<LineString, FootwayFields>;
