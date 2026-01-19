import { Feature, Point } from "geojson";

import { BaseNodeFields } from "../nodes/base-node-fields";

/**
 * Fields that identify a custom node.
 */
interface CustomNodeIdentifyingFields extends BaseNodeFields {

}

/**
 * Fields that apply to a custom node.
 */
interface CustomNodeFields extends CustomNodeIdentifyingFields {

}

/**
 * A custom node is a user-defined Point feature which is part of the traversible graph.
 */
export type CustomNode = Feature<Point, CustomNodeFields>;
