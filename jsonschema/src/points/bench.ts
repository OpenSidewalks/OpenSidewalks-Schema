import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";

/**
 * Fields that identify a bench.
 */
interface BenchIdentifyingFields extends BasePointFields {
  amenity: "bench";
}

/**
 * Fields that apply to a bench.
 */
interface BenchFields extends BenchIdentifyingFields {

}

/**
 * A bench - a place for people to sit; allows room for several people.
 */
export type Bench = Feature<Point, BenchFields>;
