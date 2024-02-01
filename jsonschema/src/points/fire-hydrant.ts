import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";

/**
 * Fields that identify a fire hydrant.
 */
interface FireHydrantIdentifyingFields extends BasePointFields {
  emergency: "fire_hydrant";
}

/**
 * Fields that apply to a fire hydrant.
 */
interface FireHydrantFields extends FireHydrantIdentifyingFields {

}

/**
 * A fire hydrant - where fire response teams connect high-pressure hoses.
 */
export type FireHydrant = Feature<Point, FireHydrantFields>;
