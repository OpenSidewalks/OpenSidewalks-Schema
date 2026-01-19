import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "../edges/base-edge-fields";

/**
 * Fields that identify a custom edge.
 */
interface CustomEdgeIdentifyingFields extends BaseEdgeFields {

}

/**
 * Fields that apply to a custom edge.
 */
interface CustomEdgeFields extends CustomEdgeIdentifyingFields {

}

/**
 * A custom edge is a user-defined, traversible LineString feature. It can represent any custom path (e.g., temporary detour route).
 */
export type CustomEdge = Feature<LineString, CustomEdgeFields>;
