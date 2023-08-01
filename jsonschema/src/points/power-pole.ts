import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";

/**
 * Fields that identify a power pole.
 */
interface PowerPoleIdentifyingFields extends BasePointFields {
  power: "pole";
}

/**
 * Fields that apply to a power pole.
 */
interface PowerPoleFields extends PowerPoleIdentifyingFields {

}

/**
 * A power pole. Often made of wood or metal, they hold power lines.
 */
export type PowerPole = Feature<Point, PowerPoleFields>;
