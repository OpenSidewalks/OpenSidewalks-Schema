import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";

/**
 * Fields that identify a bare point.
 */
interface BarePointIdentifyingFields extends BasePointFields {}

/**
 * Fields that apply to a bare point.
 */
interface BarePointFields extends BarePointIdentifyingFields {}

/**
 * A bare point type should not be part of the schema, as opposed to a bare node which can be part of the network. It's created merely to create a placeholder for common fields.
 */
export type BarePoint = Feature<Point, BarePointFields>;
