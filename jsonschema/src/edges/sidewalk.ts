import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import { FootwayFields } from "./footway";

/**
 * Fields that identify a sidewalk.
 */
interface SidewalkIdentifyingFields extends BaseEdgeFields {
  highway: "footway";
  footway: "sidewalk";
}

/**
 * Fields that apply to a sidewalk.
 */
interface SidewalkFields
  extends SidewalkIdentifyingFields,
  FootwayFields {};

/**
 * The centerline of a sidewalk, a designated pedestrian pathway to the side of a street.
 */
export type Sidewalk = Feature<LineString, SidewalkFields>;
