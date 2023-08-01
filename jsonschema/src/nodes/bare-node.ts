import { Feature, Point } from "geojson";

import { BaseNodeFields } from "./base-node-fields";

/**
 * Fields that identify a bare node.
 */
interface BareNodeIdentifyingFields extends BaseNodeFields {}

/**
 * Fields that apply to a bare node.
 */
interface BareNodeFields extends BareNodeIdentifyingFields {}

/**
 * A node that is merely part of the graph structure but has no metadata or meaning of its own. For example, a sidewalk may be split into two edges because they have differing widths, so they must be joined by a node - but there is no data to place on the node itself beyond basic spatial and graph primitives.
 */
export type BareNode = Feature<Point, BareNodeFields>;
