import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "./base-edge-fields";
import { ServiceRoadFields } from "./service-road";

/**
 * Fields that identify a driveway.
 */
interface DrivewayIdentifyingFields extends BaseEdgeFields {
  highway: "service";
  service: "driveway";
}

/**
 * Fields that apply to a driveway.
 */
interface DrivewayFields extends DrivewayIdentifyingFields, ServiceRoadFields {}

/**
 * The centerline of a driveway. Typically connects a residence or business
to another road.
 */
export type Driveway = Feature<LineString, DrivewayFields>;
