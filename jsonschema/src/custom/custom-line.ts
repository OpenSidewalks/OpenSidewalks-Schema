import { Feature, LineString } from "geojson";

import { BaseLineFields } from "../lines/base-line-fields";

/**
 * Fields that identify a custom line.
 */
interface CustomLineIdentifyingFields extends BaseLineFields {

}

/**
 * Fields that apply to a custom line.
 */
interface CustomLineFields extends CustomLineIdentifyingFields {

}

/**
 * A custom line is a user-defined LineString feature. It can represent any custom path or linear infrastructure (e.g., temporary detour route).
 */
export type CustomLine = Feature<LineString, CustomLineFields>;
