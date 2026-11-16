import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import { RoadFields } from "./roads/road";

/**
 * Fields that identify a living street.
 */
interface LivingStreetIdentifyingFields extends BaseEdgeFields {
  highway: "living_street";
}

/**
 * Fields that apply to a living street.
 */
export interface LivingStreetFields
  extends LivingStreetIdentifyingFields,
  RoadFields {}

/**
 * A street designed with the interests of pedestrians and cyclists in mind by providing enriching and experiential spaces.
 */
export type LivingStreet = Feature<LineString, LivingStreetFields>;
