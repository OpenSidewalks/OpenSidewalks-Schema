import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import {
  Brunnel,
  Description,
  Incline,
  Layer,
  Length,
  Name,
  StepCount,
  Surface,
  Width,
} from "../fields";

/**
 * Fields that identify steps.
 */
interface StepsIdentifyingFields extends BaseEdgeFields {
  highway: "steps";
}

export interface StepsFields extends StepsIdentifyingFields {
  /**
   * Fields that apply to steps.
   */
  brunnel?: Brunnel;
  description?: Description;
  incline?: Incline;
  layer?: Layer;
  length?: Length;
  name?: Name;
  surface?: Surface;
  width?: Width;
  step_count?: StepCount;
}

/**
 * For flights of steps on footways and paths.
 */
export type Steps = Feature<LineString, StepsFields>;
