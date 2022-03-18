import { Node } from "./nodes";
import { Edge } from "./edges";

export interface OpenSidewalksFeatureCollection {
  type: "FeatureCollection";
  features: (Node | Edge)[];
}
