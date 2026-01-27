import { Feature, Polygon } from "geojson";

import { BaseZoneFields } from "../zones/base-zone-fields";

/**
 * Fields that identify a custom zone.
 */
interface CustomZoneIdentifyingFields extends BaseZoneFields {

}

/**
 * Fields that apply to a custom zone.
 */
interface CustomZoneFields extends CustomZoneIdentifyingFields {

}

/**
 * A custom zone is a user-defined Polygon feature which is traversible. It can represent any custom zone (e.g., a public grassy zone).
 */
export type CustomZone = Feature<Polygon, CustomZoneFields>;
