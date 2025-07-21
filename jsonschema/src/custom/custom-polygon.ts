import { Feature, Polygon } from "geojson";

import { BasePolygonFields } from "../polygons/base-polygon-fields";

/**
 * Fields that identify a custom polygon.
 */
interface CustomPolygonIdentifyingFields extends BasePolygonFields {

}

/**
 * Fields that apply to a custom polygon.
 */
interface CustomPolygonFields extends CustomPolygonIdentifyingFields {

}

/**
 * A custom polygon is a user-defined Polygon feature. It can represent any custom area or zone (e.g., event footprint).
 */
export type CustomPolygon = Feature<Polygon, CustomPolygonFields>;
