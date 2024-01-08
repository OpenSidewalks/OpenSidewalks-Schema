import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "../base-edge-fields";
import { RoadFields } from "./road";

/**
 * Fields that identify a primary street.
 */
interface PrimaryStreetIdentifyingFields extends BaseEdgeFields {
  highway: "primary";
}

/**
 * Fields that apply to a primary street.
 */
export interface PrimaryStreetFields
  extends PrimaryStreetIdentifyingFields,
  RoadFields {}

/**
 * The centerline of a major highway.
 */
export type PrimaryStreet = Feature<LineString, PrimaryStreetFields>;
