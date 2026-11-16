import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import {
  Description,
  Incline,
  Length,
  Name,
  Surface,
  Width,
} from "../fields";

interface CyclePathFields extends BaseEdgeFields {
  highway: "cycleway";
  description?: Description;
  incline?: Incline;
  length?: Length;
  name?: Name;
  surface?: Surface;
  width?: Width;
}

/**
 * A path dedicated to cyclists and physically separated from vehicle traffic.
 */
export type CyclePath = Feature<LineString, CyclePathFields>;
