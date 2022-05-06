import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import { FootwayFields } from "./footway";

/**
 * Fields that identify a traffic island.
 */
interface TrafficIslandIdentifyingFields extends BaseEdgeFields {
  highway: "footway";
  footway: "traffic_island";
}

/**
 * Fields that apply to a traffic island.
 */
interface TrafficIslandFields
  extends TrafficIslandIdentifyingFields,
    FootwayFields {}

/**
 * The centerline of a footpath traversing a traffic island. Some complex, long, or busy pedestrian crossings have a built-up "island" to protect pedestrians, splitting up the crossing of the street into two or more crossings. As a pedestrian uses this crossing, they will transition across these path elements: sidewalk → footway → crossing → traffic island → crossing → footway → sidewalk.
 */
export type TrafficIsland = Feature<LineString, TrafficIslandFields>;
