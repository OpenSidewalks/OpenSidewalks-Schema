import { Feature, Polygon } from "geojson";

import { BaseZoneFields } from "./base-zone-fields";
import {
    Description,
    Name,
    Surface,
  } from "../fields";

/**
 * Fields that identify a pedestrian zone.
 */
interface PedestrianZoneIdentifyingFields extends BaseZoneFields {
  highway: "pedestrian";
}

/**
 * Fields that apply to a pedestrian zone.
 */
interface PedestrianZoneFields extends PedestrianZoneIdentifyingFields {
    description?: Description;
    name?: Name;
    surface?: Surface;
}

/**
 * An areas where pedestrians can travel freely in all directions.
 */
export type PedestrianZone = Feature<Polygon, PedestrianZoneFields>;
