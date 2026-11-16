import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";

interface BicycleParkingFields extends BasePointFields {
  amenity: "bicycle_parking";
}

/**
 * A facility designed to secure and park bicycles.
 */
export type BicycleParking = Feature<Point, BicycleParkingFields>;
