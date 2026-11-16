import { Feature, Point } from "geojson";

import { BasePointFields } from "./base-point-fields";

interface PublicTransportShelterPointFields extends BasePointFields {
  amenity: "shelter";
  shelter_type: "public_transport";
}

/**
 * A shelter for waiting public transit passengers, mapped as a point.
 */
export type PublicTransportShelterPoint =
  Feature<Point, PublicTransportShelterPointFields>;
