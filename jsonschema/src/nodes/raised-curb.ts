import { Feature, Point } from "geojson";

import { BaseNodeFields } from "./base-node-fields";

/**
 * Fields that identify a raised curb.
 */
interface RaisedCurbIdentifyingFields extends BaseNodeFields {
  kerb: "raised";
}

/**
 * Fields that apply to a raised curb.
 */
interface RaisedCurbFields extends RaisedCurbIdentifyingFields {

}

/**
 * A single, designed vertical displacement that separates two edges. A common example is the curb that separates a street crossing from a sidewalk. This is mapped at the point where the two edges meet - on top of the curb is physically located.
 */
export type RaisedCurb = Feature<Point, RaisedCurbFields>;
