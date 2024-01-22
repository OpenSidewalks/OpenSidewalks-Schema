import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "../base-edge-fields";
import { RoadFields } from "./road";

/**
 * Fields that identify a trunk road.
 */
interface TrunkRoadIdentifyingFields extends BaseEdgeFields {
  highway: "trunk";
}

/**
 * Fields that apply to a trunk road.
 */
export interface TrunkRoadFields
  extends TrunkRoadIdentifyingFields,
  RoadFields {}

/**
 * A high-performance or high-importance roads that don't meet the requirements for motorway, but are not classified as highway=primary either.
 */
export type TrunkRoad = Feature<LineString, TrunkRoadFields>;
