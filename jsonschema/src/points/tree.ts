import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";
import {
  LeafCycle,
  LeafType,
} from "fields";

/**
 * Fields that identify a tree.
 */
interface TreeIdentifyingFields extends BasePointFields {
  natural: "tree";
}

/**
 * Fields that apply to a tree.
 */
interface TreeFields extends TreeIdentifyingFields {
  leaf_type?: LeafType;
  leaf_cycle?: LeafCycle;
}

/**
 * A tree - a tall, woody plant with branches emanating from a central trunk.
 */
export type Tree = Feature<Point, TreeFields>;
