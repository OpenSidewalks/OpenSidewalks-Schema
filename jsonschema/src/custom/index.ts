import { CustomLine } from "./custom-line";
import { CustomPoint } from "./custom-point";
import { CustomPolygon } from "./custom-polygon";

export type CustomEntity =
  | CustomPoint
  | CustomLine
  | CustomPolygon;
