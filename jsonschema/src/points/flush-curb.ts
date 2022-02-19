import { Feature, Point } from "geojson";

import { Brunnel, Layer } from "../fields";

/**
 * Fields that identify a flush curb.
 */
interface FlushCurbIdentifyingFields {
  kerb: "flush";
}

/**
 * Fields that apply to a flush curb.
 */
interface FlushCurbFields extends FlushCurbIdentifyingFields {
  brunnel?: Brunnel;
  layer?: Layer;
}

/**
 * An indicator that there is no raised curb interface where two paths meet - i.e. where someone might expect a curb interface, such as where a crossing and footpath meet.
 */
export type FlushCurb = Feature<Point, FlushCurbFields>;
