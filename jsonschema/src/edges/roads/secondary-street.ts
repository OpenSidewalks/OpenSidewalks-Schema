import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "../base-edge-fields";
import { RoadFields } from "./road";

/**
 * Fields that identify a secondary street.
 */
interface SecondaryStreetIdentifyingFields extends BaseEdgeFields {
  highway: "secondary";
}

/**
 * Fields that apply to a secondary street.
 */
export interface SecondaryStreetFields
  extends SecondaryStreetIdentifyingFields,
  RoadFields {}

/**
 * The centerline of a secondary highway: not a major highway, but forms a major link in the national route network.
 */
export type SecondaryStreet = Feature<LineString, SecondaryStreetFields>;
