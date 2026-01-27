import { Feature, Point } from "geojson";

import { BasePointFields } from "../points/base-point-fields";

/**
 * Fields that identify a custom point.
 */
interface CustomPointIdentifyingFields extends BasePointFields {

}

/**
 * Fields that apply to a custom point.
 */
interface CustomPointFields extends CustomPointIdentifyingFields {

}

/**
 * A custom point is a user-defined Point feature. It can represent any custom-location marker (e.g., a survey marker).
 */
export type CustomPoint = Feature<Point, CustomPointFields>;
