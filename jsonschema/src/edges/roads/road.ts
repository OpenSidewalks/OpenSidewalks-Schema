import {
    Description,
    Foot,
    Incline,
    Length,
    Name,
    Surface,
    Width,
  } from "../../fields";
import { RoadsideFields } from "./roadside-fields";

/**
 * Fields that apply to roads.
 */
export interface RoadFields extends RoadsideFields {
    description?: Description;
    foot?: Foot;
    incline?: Incline;
    length?: Length;
    name?: Name;
    surface?: Surface;
    width?: Width;
  }