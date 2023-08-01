import { Node } from "./nodes";
import { Edge } from "./edges";
import { Point } from "./points";

export interface OpenSidewalksFeatureCollection {
  type: "FeatureCollection";
  features: (Point | Node | Edge)[];
}
