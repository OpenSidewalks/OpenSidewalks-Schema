import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import {
  Description,
  Incline,
  Length,
  Name,
  Surface,
  Width,
} from "../fields";

/**
 * Fields that identify a living street.
 */
interface LivingStreetIdentifyingFields extends BaseEdgeFields {
  highway: "living_street";
}

/**
 * Fields that apply to a living street.
 */
export interface LivingStreetFields extends LivingStreetIdentifyingFields {
  description?: Description;
  incline?: Incline;
  length?: Length;
  name?: Name;
  surface?: Surface;
  width?: Width;
}

/**
 * A street designed with the interests of pedestrians and cyclists in mind by providing enriching and experiential spaces.
 */
export type LivingStreet = Feature<LineString, LivingStreetFields>;
