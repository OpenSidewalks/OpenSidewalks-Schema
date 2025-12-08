import { CompatibleSchemaURI } from "fields";
import { MultiPolygon } from "geojson";
import { Zone } from "zones";
import { CustomZone } from "custom/custom-zone";

export interface OpenSidewalksZonesCollection {
  type: "FeatureCollection";
  $schema: CompatibleSchemaURI;
  dataSource?: object;
  region?: MultiPolygon;
  dataTimestamp?: Date;
  pipelineVersion?: object;
  features: (Zone | CustomZone)[];
}
