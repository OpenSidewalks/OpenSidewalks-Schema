import { Feature, Point } from "geojson";

import { BaseNodeFields } from "./base-node-fields";
import { TactilePaving } from "../fields";

/**
 * Fields that identify a rolled curb.
 */
interface RolledCurbIdentifyingFields extends BaseNodeFields {
  barrier: "kerb";
  kerb: "rolled";
}

/**
 * Fields that apply to a rolled curb.
 */
interface RolledCurbFields extends RolledCurbIdentifyingFields {
  tactile_paving?: TactilePaving;
}

/**
 * A curb interface with a quarter-circle profile: traversing this curb is like going over half of a bump. Located where two edges meet, physically at the location of the curb itself.
 */
export type RolledCurb = Feature<Point, RolledCurbFields>;
