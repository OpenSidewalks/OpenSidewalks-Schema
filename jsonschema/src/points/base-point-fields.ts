// All Points must define an _id, serving as a unique identifier of that point.

/**
 * @minLength 1
 */
export type PointID = string;

export interface BasePointFields {
  _id: PointID;
}
