import { Feature, LineString } from "geojson";

import { ServiceRoadFields } from "./service-road";

/**
 * Fields that identify a parking aisle.
 */
interface ParkingAisleIdentifyingFields {
  highway: "service";
  service: "parking_aisle";
}

/**
 * Fields that apply to a parking aisle.
 */
type ParkingAisleFields = ParkingAisleIdentifyingFields & ServiceRoadFields;

/**
 * The centerline of a subordinated way in a parking lot: vehicles drive on parking aisles to reach parking spaces in a parking lot.
 */
export type ParkingAisle = Feature<LineString, ParkingAisleFields>;
