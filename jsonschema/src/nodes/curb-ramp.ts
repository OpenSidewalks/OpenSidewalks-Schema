import { Feature, Point } from "geojson";

import { BaseNodeFields } from "./base-node-fields";
import { TactilePaving } from "../fields";

/**
 * Fields that identify a curb ramp.
 */
interface CurbRampIdentifyingFields extends BaseNodeFields {
  barrier: "kerb";
  kerb: "lowered";
}

/**
 * Fields that apply to a curb ramp.
 */
interface CurbRampFields extends CurbRampIdentifyingFields {
  tactile_paving?: TactilePaving;
}

/**
 * A curb ramp (curb cut) mapped as a curb interface. Mapped at the location where the two edges that it connects meet one another.
 *
 */
export type CurbRamp = Feature<Point, CurbRampFields>;
