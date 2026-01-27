import { CompatibleSchemaURI } from "fields";
import { MultiPolygon } from "geojson";
import { Node } from "nodes";
import { CustomNode } from "custom/custom-node";

export interface OpenSidewalksNodesCollection {
  type: "FeatureCollection";
  $schema: CompatibleSchemaURI;
  dataSource?: object;
  region?: MultiPolygon;
  dataTimestamp?: Date;
  pipelineVersion?: object;
  features: (Node | CustomNode)[];
}
