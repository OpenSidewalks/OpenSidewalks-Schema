import { Feature, LineString } from "geojson";

import { FootwayFields } from "./footway";

/**
 * Fields that identify a sidewalk.
 */
interface SidewalkIdentifyingFields {
  highway: "footway";
  footway: "sidewalk";
}

/**
 * Fields that apply to a sidewalk.
 */
type SidewalkFields = SidewalkIdentifyingFields & FootwayFields;

/**
 * The centerline of a sidewalk, a designated pedestrian pathway to the side of a street.
 */
export type Sidewalk = Feature<LineString, SidewalkFields>;