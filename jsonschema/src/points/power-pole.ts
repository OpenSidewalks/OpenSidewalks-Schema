import { Feature, Point } from "geojson";

import { Brunnel, Layer } from "../fields";

/**
 * Fields that identify a power pole.
 */
interface PowerPoleIdentifyingFields {
  power: "pole";
}

/**
 * Fields that apply to a power pole.
 */
interface PowerPoleFields extends PowerPoleIdentifyingFields {
  brunnel?: Brunnel;
  layer?: Layer;
}

/**
 * A power pole. Often made of wood or metal, they hold power lines.
 */
export type PowerPole = Feature<Point, PowerPoleFields>;
