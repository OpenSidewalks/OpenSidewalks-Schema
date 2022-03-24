import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import {
  Brunnel,
  Description,
  Foot,
  Incline,
  Layer,
  Length,
  Surface,
  Width,
} from "../fields";

/**
 * Fields that identify a service road.
 */
interface ServiceRoadIdentifyingFields extends BaseEdgeFields {
  highway: "service";
}

/**
 * Fields that apply to a service road.
 * primary street.
 */
export interface ServiceRoadFields extends ServiceRoadIdentifyingFields {
  brunnel?: Brunnel;
  description?: Description;
  incline?: Incline;
  foot?: Foot;
  layer?: Layer;
  length?: Length;
  surface?: Surface;
  width?: Width;
}

/**
 * A road intended for service use.
 */
export type ServiceRoad = Feature<LineString, ServiceRoadFields>;
