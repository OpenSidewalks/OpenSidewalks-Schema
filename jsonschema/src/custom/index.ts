import { CustomEdge } from "./custom-edge";
import { CustomNode } from "./custom-node";
import { CustomZone } from "./custom-zone";
import { CustomLine } from "./custom-line";
import { CustomPoint } from "./custom-point";
import { CustomPolygon } from "./custom-polygon";

export type CustomEntity =
  | CustomNode
  | CustomEdge
  | CustomZone
  | CustomPoint
  | CustomLine
  | CustomPolygon;
