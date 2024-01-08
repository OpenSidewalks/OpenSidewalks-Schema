import { Node } from "./nodes";
import { Edge } from "./edges";
import { Point } from "./points";
import { Zone } from "./zones";
import { Line } from "./lines";
import { Polygon } from "./polygons";
import { SchemaID } from "./fields";
import { MultiPolygon } from "geojson";

export interface OpenSidewalksFeatureCollection {
  type: "FeatureCollection";
  $schema: SchemaID;
  dataSource?: string;
  region?: MultiPolygon;
  dataTimestamp?: Date;
  pipelineVersion?: string;
  features: (Point | Node | Edge | Zone | Line | Polygon)[];
}
