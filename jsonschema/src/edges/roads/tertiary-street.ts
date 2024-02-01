import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "../base-edge-fields";
import { RoadFields } from "./road";

/**
 * Fields that identify a tertiary street.
 */
interface TertiaryStreetIdentifyingFields extends BaseEdgeFields {
  highway: "tertiary";
}

/**
 * Fields that apply to a tertiary street.
 */
export interface TertiaryStreetFields
  extends TertiaryStreetIdentifyingFields,
  RoadFields {}

/**
 * A road linking small settlements, or the local centers of a large town or city.
 */
export type TertiaryStreet = Feature<LineString, TertiaryStreetFields>;
