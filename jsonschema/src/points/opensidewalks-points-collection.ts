import { CompatibleSchemaURI } from "fields";
import { MultiPolygon } from "geojson";
import { Point } from "points";
import { CustomPoint } from "custom/custom-point";

export interface OpenSidewalksPointsCollection {
  type: "FeatureCollection";
  $schema: CompatibleSchemaURI;
  dataSource?: object;
  region?: MultiPolygon;
  dataTimestamp?: Date;
  pipelineVersion?: object;
  features: (Point | CustomPoint)[];
}
