import { Feature, LineString } from "geojson";

import { BaseLineFields } from "./base-line-fields";
import {
  LeafCycle,
  LeafType,
} from "fields";

/**
 * Fields that identify a tree row.
 */
interface TreeRowIdentifyingFields extends BaseLineFields {
  natural: "tree_row";
}

/**
 * Fields that apply to a tree row.
 */
interface TreeRowFields extends TreeRowIdentifyingFields {
  leaf_type?: LeafType;
  leaf_cycle?: LeafCycle;
}

/**
 * A tree row is a line of trees often found along roadways, property lines, or at the edges of farms.
 */
export type TreeRow = Feature<LineString, TreeRowFields>;
