import { Feature, LineString } from "geojson";

import { BaseEdgeFields } from "../base-edge-fields";
import { ServiceRoadFields } from "./service-road";

/**
 * Fields that identify an alley.
 */
interface AlleyIdentifyingFields extends BaseEdgeFields {
  highway: "service";
  service: "alley";
}

/**
 * Fields that apply to an alley.
 */
interface AlleyFields
  extends AlleyIdentifyingFields,
  ServiceRoadFields {};

/**
 * The centerline of an alley. An alley is usually located between properties and provides access to utilities and private entrances.
 */
export type Alley = Feature<LineString, AlleyFields>;
