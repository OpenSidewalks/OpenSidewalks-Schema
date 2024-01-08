import { Feature, Point } from "geojson";

import { BaseNodeFields } from "./base-node-fields";
import { TactilePaving } from "../fields";

/**
 * Fields that identify an unknown curb.
 */
interface UnknownCurbIdentifyingFields extends BaseNodeFields {
  barrier: "kerb";
  kerb: "yes";
}

/**
 * Fields that apply to an unknown curb.
 */
interface UnknownCurbFields extends UnknownCurbIdentifyingFields {
  tactile_paving?: TactilePaving;
}

/**
 * A curb for which a type could not be determined despite some effort.
 */
export type UnknownCurb = Feature<Point, UnknownCurbFields>;
