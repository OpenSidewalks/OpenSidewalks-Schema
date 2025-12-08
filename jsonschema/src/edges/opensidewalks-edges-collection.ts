import { CompatibleSchemaURI } from "fields";
import { MultiPolygon } from "geojson";
import { Edge } from "edges";
import { CustomEdge } from "custom/custom-edge";

export interface OpenSidewalksEdgesCollection {
  type: "FeatureCollection";
  $schema: CompatibleSchemaURI;
  dataSource?: object;
  region?: MultiPolygon;
  dataTimestamp?: Date;
  pipelineVersion?: object;
  features: (Edge | CustomEdge)[];
}
