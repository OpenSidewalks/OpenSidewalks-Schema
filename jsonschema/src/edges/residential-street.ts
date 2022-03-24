import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import {
  Brunnel,
  Description,
  Foot,
  Incline,
  Layer,
  Length,
  Name,
  Surface,
  Width,
} from "../fields";

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
  extends ResidentialStreetIdentifyingFields {
  brunnel?: Brunnel;
  description?: Description;
  incline?: Incline;
  foot?: Foot;
  layer?: Layer;
  length?: Length;
  name?: Name;
  surface?: Surface;
  width?: Width;
}

/**
 * A residential street.
 */
export type ResidentialStreet = Feature<LineString, ResidentialStreetFields>;
