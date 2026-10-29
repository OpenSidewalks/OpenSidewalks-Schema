import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "../base-edge-fields";
import { RoadFields } from "./road";

interface TrackFields extends BaseEdgeFields, RoadFields {
  highway: "track";
}

/**
 * A road for agricultural, forestry, or similar use, often unpaved.
 */
export type Track = Feature<LineString, TrackFields>;
