import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";

interface StreetCabinetFields extends BasePointFields {
  man_made: "street_cabinet";
}

/**
 * A ground-level utility equipment enclosure.
 */
export type StreetCabinet = Feature<Point, StreetCabinetFields>;
