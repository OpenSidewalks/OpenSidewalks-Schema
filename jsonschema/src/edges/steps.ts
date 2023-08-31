import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import {
  Climb,
  Description,
  Incline,
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
  description?: Description;
  incline?: Incline;
  length?: Length;
  name?: Name;
  surface?: Surface;
  width?: Width;
  step_count?: StepCount;
  climb?: Climb;
}

/**
 * For flights of steps on footways and paths.
 */
export type Steps = Feature<LineString, StepsFields>;
