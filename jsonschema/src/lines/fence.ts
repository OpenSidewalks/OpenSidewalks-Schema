import { Feature, LineString } from "geojson";

import { BaseLineFields } from "./base-line-fields";

/**
 * Fields that identify a fence.
 */
interface FenceIdentifyingFields extends BaseLineFields {
  barrier: "fence";
}

/**
 * Fields that apply to a fence.
 */
interface FenceFields extends FenceIdentifyingFields {

}

/**
 * A fence is a freestanding structure designed to restrict or prevent movement across a boundary. It is generally distinguished from a wall by the lightness of its construction.
 */
export type Fence = Feature<LineString, FenceFields>;
