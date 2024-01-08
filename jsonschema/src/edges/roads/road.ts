import {
    Description,
    Foot,
    Incline,
    Length,
    Name,
    Surface,
    Width,
  } from "../../fields";

/**
 * Fields that apply to roads.
 */
export interface RoadFields {
    description?: Description;
    foot?: Foot;
    incline?: Incline;
    length?: Length;
    name?: Name;
    surface?: Surface;
    width?: Width;
  }