import { Feature, LineString } from "geojson";

import {
  Brunnel,
  Description,
  Foot,
  Incline,
  Layer,
  Length,
  Name,
  Surface,
  Width,
} from "../fields";

/**
 * Fields that identify a cycleway.
 */
interface CyclewayIdentifyingFields {
  highway: "cycleway";
}

export interface CyclewayFields extends CyclewayIdentifyingFields {
  /**
   * Fields that apply to a cycleway.
   */
  brunnel?: Brunnel;
  description?: Description;
  incline?: Incline;
  foot?: Foot;
  layer?: Layer;
  length?: Length;
  name?: Name;
  surface?: Surface;
  width?: Width;
}

/**
 * The centerline of a designated cycling pathway. This pathway may or may not permit pedestrian use.
 */
export type Cycleway = Feature<LineString, CyclewayFields>;
