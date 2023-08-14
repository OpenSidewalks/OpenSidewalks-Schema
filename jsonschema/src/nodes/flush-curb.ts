import { Feature, Point } from "geojson";

import { BaseNodeFields } from "./base-node-fields";
import { TactilePaving } from "fields";

/**
 * Fields that identify a flush curb.
 */
interface FlushCurbIdentifyingFields extends BaseNodeFields {
  barrier: "kerb";
  kerb: "flush";
}

/**
 * Fields that apply to a flush curb.
 */
interface FlushCurbFields extends FlushCurbIdentifyingFields {
  tactile_paving?: TactilePaving;
}

/**
 * An indicator that there is no raised curb interface where two paths meet - i.e. where someone might expect a curb interface, such as where a crossing and footpath meet.
 */
export type FlushCurb = Feature<Point, FlushCurbFields>;
