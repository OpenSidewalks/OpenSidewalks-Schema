import { Feature, Point } from "geojson";

import { Brunnel, Layer } from "../fields";

/**
 * Fields that identify a fire hydrant.
 */
interface FireHydrantIdentifyingFields {
  emergency: "fire_hydrant";
}

/**
 * Fields that apply to a fire hydrant.
 */
interface FireHydrantFields extends FireHydrantIdentifyingFields {
  brunnel?: Brunnel;
  layer?: Layer;
}

/**
 * A fire hydrant - where fire response teams connect high-pressure hoses.
 */
export type FireHydrant = Feature<Point, FireHydrantFields>;
