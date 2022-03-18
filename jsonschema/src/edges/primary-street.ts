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
 * Fields that identify a primary street.
 */
interface PrimaryStreetIdentifyingFields extends BaseEdgeFields {
  highway: "primary";
}

/**
 * Fields that apply to a primary street.
 */
export interface PrimaryStreetFields extends PrimaryStreetIdentifyingFields {
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
 * The centerline of a major highway.
 */
export type PrimaryStreet = Feature<LineString, PrimaryStreetFields>;
