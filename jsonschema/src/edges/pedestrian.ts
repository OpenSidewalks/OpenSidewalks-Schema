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
 * Fields that identify a pedestrian road.
 */
interface PedestrianIdentifyingFields extends BaseEdgeFields {
  highway: "pedestrian";
}

export interface PedestrianFields extends PedestrianIdentifyingFields {
  /**
   * Fields that apply to a pedestrian road.
   */
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
 * For a road or an area mainly or exclusively for pedestrians in which some vehicle traffic may be authorized.
 */
export type Pedestrian = Feature<LineString, PedestrianFields>;
