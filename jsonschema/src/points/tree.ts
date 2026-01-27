import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";
import {
  TreeLeafCycle,
  TreeLeafType,
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
  leaf_type?: TreeLeafType;
  leaf_cycle?: TreeLeafCycle;
}

/**
 * A tree - a tall, woody plant with branches emanating from a central trunk.
 */
export type Tree = Feature<Point, TreeFields>;
