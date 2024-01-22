import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "../base-edge-fields";
import { RoadFields } from "./road";

/**
 * Fields that identify an unclassified road.
 */
interface UnclassifiedRoadIdentifyingFields extends BaseEdgeFields {
  highway: "unclassified";
}

/**
 * Fields that apply to an unclassified road.
 */
export interface UnclassifiedRoadFields
  extends UnclassifiedRoadIdentifyingFields,
  RoadFields {}

/**
 * A minor public roads, typically at the lowest level of whatever administrative hierarchy is used in that jurisdiction.
 */
export type UnclassifiedRoad = Feature<LineString, UnclassifiedRoadFields>;
