import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";

/**
 * Fields that identify a manhole.
 */
interface ManholeIdentifyingFields extends BasePointFields {
  man_made: "manhole";
}

/**
 * Fields that apply to a manhole.
 */
interface ManholeFields extends ManholeIdentifyingFields {

}

/**
 * A manhole - a hole with a cover that allows access to an underground service location, just large enough for a human to climb through.
 */
export type Manhole = Feature<Point, ManholeFields>;
