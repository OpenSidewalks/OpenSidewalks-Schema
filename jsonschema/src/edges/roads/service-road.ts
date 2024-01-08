import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "../base-edge-fields";
import { RoadFields } from "./road";

/**
 * Fields that identify a service road.
 */
interface ServiceRoadIdentifyingFields extends BaseEdgeFields {
  highway: "service";
}

/**
 * Fields that apply to a service road.
 */
export interface ServiceRoadFields
  extends ServiceRoadIdentifyingFields,
  RoadFields {}

/**
 * A road intended for service use.
 */
export type ServiceRoad = Feature<LineString, ServiceRoadFields>;
