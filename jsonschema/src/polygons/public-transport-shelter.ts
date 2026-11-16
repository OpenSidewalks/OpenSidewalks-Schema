import { Feature, Polygon } from "geojson";

import { BasePolygonFields } from "./base-polygon-fields";

interface PublicTransportShelterPolygonFields extends BasePolygonFields {
  amenity: "shelter";
  shelter_type: "public_transport";
}

/**
 * A shelter for waiting public transit passengers, mapped as a polygon.
 */
export type PublicTransportShelterPolygon =
  Feature<Polygon, PublicTransportShelterPolygonFields>;
