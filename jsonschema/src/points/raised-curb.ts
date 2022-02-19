import { Feature, Point } from "geojson";

import { Brunnel, Layer } from "../fields";

/**
 * Fields that identify a raised curb.
 */
interface RaisedCurbIdentifyingFields {
  kerb: "rolled";
}

/**
 * Fields that apply to a raised curb.
 */
interface RaisedCurbFields extends RaisedCurbIdentifyingFields {
  brunnel?: Brunnel;
  layer?: Layer;
}

/**
 * A single, designed vertical displacement that separates two pathways. A common example is the curb that separates a street crossing from a sidewalk. This is mapped at the point where the two paths meet - on top of the curb is physically located.
 */
export type RaisedCurb = Feature<Point, RaisedCurbFields>;
