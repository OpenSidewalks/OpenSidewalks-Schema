// All Points must define an _id, serving as a unique identifier of that point.

import { Brunnel, Layer } from "../fields";

export type PointID = string;

export interface BasePointFields {
  _id: PointID;
  brunnel?: Brunnel;
  layer?: Layer;
}
