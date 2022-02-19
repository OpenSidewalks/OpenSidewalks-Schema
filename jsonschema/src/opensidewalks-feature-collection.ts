import { Point } from "./points";
import { Pathway } from "./pathways";

export interface OpenSidewalksFeatureCollection {
  type: "FeatureCollection";
  features: (Point | Pathway)[];
}
