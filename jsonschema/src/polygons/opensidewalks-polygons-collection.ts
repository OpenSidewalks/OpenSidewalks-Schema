import { CompatibleSchemaURI } from "fields";
import { MultiPolygon } from "geojson";
import { Polygon } from "polygons";
import { CustomPolygon } from "custom/custom-polygon";

export interface OpenSidewalksPolygonsCollection {
  type: "FeatureCollection";
  $schema: CompatibleSchemaURI;
  dataSource?: object;
  region?: MultiPolygon;
  dataTimestamp?: Date;
  pipelineVersion?: object;
  features: (Polygon | CustomPolygon)[];
}
