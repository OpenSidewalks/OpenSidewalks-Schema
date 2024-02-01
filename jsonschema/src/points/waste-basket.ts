import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";

/**
 * Fields that identify a waste basket.
 */
interface WasteBasketIdentifyingFields extends BasePointFields {
  amenity: "waste_basket";
}

/**
 * Fields that apply to a waste basket.
 */
interface WasteBasketFields extends WasteBasketIdentifyingFields {

}

/**
 * A waste basket - a single small container for depositing garbage that is easily accessible for pedestrians.
 */
export type WasteBasket = Feature<Point, WasteBasketFields>;
