import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";

/**
 * Fields that identify a bollard.
 */
interface BollardIdentifyingFields extends BasePointFields {
  barrier: "bollard";
}

/**
 * Fields that apply to a bollard.
 */
interface BollardFields extends BollardIdentifyingFields {

}

/**
 * A Bollard - a solid pillar or pillars made of concrete, metal, plastic, etc., and used to control traffic.
 */
export type Bollard = Feature<Point, BollardFields>;
