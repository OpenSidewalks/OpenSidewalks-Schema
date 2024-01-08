import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "../base-edge-fields";
import { RoadFields } from "./road";


/**
 * Fields that identify a residential street.
 */
interface ResidentialStreetIdentifyingFields extends BaseEdgeFields {
  highway: "residential";
}

/**
 * Fields that apply to a residential street.
 */
export interface ResidentialStreetFields
  extends ResidentialStreetIdentifyingFields,
  RoadFields {}

/**
 * A residential street.
 */
export type ResidentialStreet = Feature<LineString, ResidentialStreetFields>;
