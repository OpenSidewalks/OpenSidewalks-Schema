// All Points must define an _id, serving as a unique identifier of that point.

export type PointID = string;

export interface BasePointFields {
  _id: PointID;
}
