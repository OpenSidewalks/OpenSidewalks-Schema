import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";

/**
 * Fields that identify a street lamp.
 */
interface StreetLampIdentifyingFields extends BasePointFields {
  highway: "street_lamp";
}

/**
 * Fields that apply to a street lamp.
 */
interface StreetLampFields extends StreetLampIdentifyingFields {

}

/**
 * A street lamp - a street light, lamppost, street lamp, light standard, or lamp standard: a raised source of light above a road, which is turned on or lit at night.
 */
export type StreetLamp = Feature<Point, StreetLampFields>;
