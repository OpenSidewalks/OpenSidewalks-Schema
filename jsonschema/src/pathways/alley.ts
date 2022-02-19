import { Feature, LineString } from "geojson";

import { ServiceRoadFields } from "./service-road";

/**
 * Fields that identify an alley.
 */
interface AlleyIdentifyingFields {
  highway: "service";
  service: "alley";
}

/**
 * Fields that apply to an alley.
 */
type AlleyFields = AlleyIdentifyingFields & ServiceRoadFields;

/**
 * The centerline of an alley. An alley is usually located between properties and provides access to utilities and private entrances.
 */
export type Alley = Feature<LineString, AlleyFields>;
