import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import { FootwayFields } from "./footway";
import { CrossingMarkings } from "../fields";

/**
 * Fields that identify a crossing.
 */
interface CrossingIdentifyingFields extends BaseEdgeFields {
  highway: "footway";
  footway: "crossing";
}

/**
 * Fields that apply to a crossing.
 */
interface CrossingFields
  extends CrossingIdentifyingFields,
  FootwayFields {
    "crossing:markings"?: CrossingMarkings;
}

/**
 * The centerline of a pedestrian street crossing. This path exists only on the road surface itself, i.e. "from curb to curb". Crossings should not be connected directly to sidewalk centerlines - instead, a short footpath (this schema calls them "links") should connect the two together.
 */
export type Crossing = Feature<LineString, CrossingFields>;
