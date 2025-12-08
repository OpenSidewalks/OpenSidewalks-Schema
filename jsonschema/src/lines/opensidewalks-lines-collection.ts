import { CompatibleSchemaURI } from "fields";
import { MultiPolygon } from "geojson";
import { Line } from "lines";
import { CustomLine } from "custom/custom-line";

export interface OpenSidewalksLinesCollection {
  type: "FeatureCollection";
  $schema: CompatibleSchemaURI;
  dataSource?: object;
  region?: MultiPolygon;
  dataTimestamp?: Date;
  pipelineVersion?: object;
  features: (Line | CustomLine)[];
}
