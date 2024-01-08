import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import {
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

/**
 * Fields that apply to steps.
 */
export interface StepsFields extends StepsIdentifyingFields {
  description?: Description;
  incline?: Incline;
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
