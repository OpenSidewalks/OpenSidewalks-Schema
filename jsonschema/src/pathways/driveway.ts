import { Feature, LineString } from "geojson";

import { ServiceRoadFields } from "./service-road";

/**
 * Fields that identify a driveway.
 */
interface DrivewayIdentifyingFields {
  highway: "service";
  service: "driveway";
}

/**
 * Fields that apply to a driveway.
 */
type DrivewayFields = DrivewayIdentifyingFields & ServiceRoadFields;

/**
 * The centerline of a driveway. Typically connects a residence or business
to another road.
 */
export type Driveway = Feature<LineString, DrivewayFields>;
