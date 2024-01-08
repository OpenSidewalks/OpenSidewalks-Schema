import { Feature, Point } from "geojson";

import { BaseNodeFields } from "./base-node-fields";
import { TactilePaving } from "../fields";

/**
 * Fields that identify a generic curb.
 */
interface GenericCurbIdentifyingFields extends BaseNodeFields {
  barrier: "kerb";
}

/**
 * Fields that apply to a generic curb.
 */
interface GenericCurbFields extends GenericCurbIdentifyingFields {
  tactile_paving?: TactilePaving;
}

/**
 * A curb for which a type has not been determined yet.
 */
export type GenericCurb = Feature<Point, GenericCurbFields>;
