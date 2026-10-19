import {
  RoadsidePresence,
  RoadsideSeparation,
  RoadsideSlope,
  RoadsideSurface,
  RoadsideWidth,
  SidewalkPresence,
} from "../../fields";

export interface RoadsideFields {
  "sidewalk:left"?: SidewalkPresence;
  "sidewalk:right"?: SidewalkPresence;

  "roadside:left"?: RoadsidePresence;
  "roadside:right"?: RoadsidePresence;
  "roadside:left:total_width"?: RoadsideWidth;
  "roadside:right:total_width"?: RoadsideWidth;

  bike_lane?: RoadsidePresence;
  "bike_lane:left"?: RoadsidePresence;
  "bike_lane:right"?: RoadsidePresence;
  paved_shoulder?: RoadsidePresence;
  "paved_shoulder:left"?: RoadsidePresence;
  "paved_shoulder:right"?: RoadsidePresence;
  unpaved_shoulder?: RoadsidePresence;
  "unpaved_shoulder:left"?: RoadsidePresence;
  "unpaved_shoulder:right"?: RoadsidePresence;
  sideslope?: RoadsidePresence;
  "sideslope:left"?: RoadsidePresence;
  "sideslope:right"?: RoadsidePresence;

  "bike_lane:surface"?: RoadsideSurface;
  "bike_lane:left:surface"?: RoadsideSurface;
  "bike_lane:right:surface"?: RoadsideSurface;
  "paved_shoulder:surface"?: RoadsideSurface;
  "paved_shoulder:left:surface"?: RoadsideSurface;
  "paved_shoulder:right:surface"?: RoadsideSurface;
  "unpaved_shoulder:surface"?: RoadsideSurface;
  "unpaved_shoulder:left:surface"?: RoadsideSurface;
  "unpaved_shoulder:right:surface"?: RoadsideSurface;
  "sideslope:surface"?: RoadsideSurface;
  "sideslope:left:surface"?: RoadsideSurface;
  "sideslope:right:surface"?: RoadsideSurface;

  "bike_lane:width"?: RoadsideWidth;
  "bike_lane:left:width"?: RoadsideWidth;
  "bike_lane:right:width"?: RoadsideWidth;
  "paved_shoulder:width"?: RoadsideWidth;
  "paved_shoulder:left:width"?: RoadsideWidth;
  "paved_shoulder:right:width"?: RoadsideWidth;
  "unpaved_shoulder:width"?: RoadsideWidth;
  "unpaved_shoulder:left:width"?: RoadsideWidth;
  "unpaved_shoulder:right:width"?: RoadsideWidth;
  "sideslope:width"?: RoadsideWidth;
  "sideslope:left:width"?: RoadsideWidth;
  "sideslope:right:width"?: RoadsideWidth;

  "bike_lane:incline"?: RoadsideSlope;
  "bike_lane:left:incline"?: RoadsideSlope;
  "bike_lane:right:incline"?: RoadsideSlope;
  "paved_shoulder:incline"?: RoadsideSlope;
  "paved_shoulder:left:incline"?: RoadsideSlope;
  "paved_shoulder:right:incline"?: RoadsideSlope;
  "unpaved_shoulder:incline"?: RoadsideSlope;
  "unpaved_shoulder:left:incline"?: RoadsideSlope;
  "unpaved_shoulder:right:incline"?: RoadsideSlope;
  "sideslope:incline"?: RoadsideSlope;
  "sideslope:left:incline"?: RoadsideSlope;
  "sideslope:right:incline"?: RoadsideSlope;

  "bike_lane:cross_slope"?: RoadsideSlope;
  "bike_lane:left:cross_slope"?: RoadsideSlope;
  "bike_lane:right:cross_slope"?: RoadsideSlope;
  "paved_shoulder:cross_slope"?: RoadsideSlope;
  "paved_shoulder:left:cross_slope"?: RoadsideSlope;
  "paved_shoulder:right:cross_slope"?: RoadsideSlope;
  "unpaved_shoulder:cross_slope"?: RoadsideSlope;
  "unpaved_shoulder:left:cross_slope"?: RoadsideSlope;
  "unpaved_shoulder:right:cross_slope"?: RoadsideSlope;
  "sideslope:cross_slope"?: RoadsideSlope;
  "sideslope:left:cross_slope"?: RoadsideSlope;
  "sideslope:right:cross_slope"?: RoadsideSlope;

  "bike_lane:separation"?: RoadsideSeparation;
  "bike_lane:left:separation"?: RoadsideSeparation;
  "bike_lane:right:separation"?: RoadsideSeparation;
  "paved_shoulder:separation"?: RoadsideSeparation;
  "paved_shoulder:left:separation"?: RoadsideSeparation;
  "paved_shoulder:right:separation"?: RoadsideSeparation;
  "unpaved_shoulder:separation"?: RoadsideSeparation;
  "unpaved_shoulder:left:separation"?: RoadsideSeparation;
  "unpaved_shoulder:right:separation"?: RoadsideSeparation;
  "sideslope:separation"?: RoadsideSeparation;
  "sideslope:left:separation"?: RoadsideSeparation;
  "sideslope:right:separation"?: RoadsideSeparation;
}
