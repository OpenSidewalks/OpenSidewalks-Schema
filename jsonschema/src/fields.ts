/**
 * A field for the type of street crossing - marked or unmarked. When derived from OpenStreetMap data, the crossing key undergoes various conversions due to fragmentation. Both the uncontrolled and zebra values are converted into marked and the traffic\_signals value is ignored.
 */
export type Crossing = "marked" | "unmarked";
/**
 * A field for markings on the ground which are meant to draw attention to the area where pedestrians are to cross the road.
 */
export type CrossingMarkings = "dashes" | "dots" | "ladder" | "ladder:paired" | "lines" | "lines:paired" | "no" | "skewed" | "surface" | "yes" | "zebra" | "zebra:bicolour" | "zebra:double" | "zebra:paired" | "rainbow" | "lines:rainbow" | "zebra:rainbow" | "ladder:skewed" | "pictograms";
/**
 * A free form text field for describing an edge of node. May be pre-encoded in relevant pedestrian paths to assist with routing instructing or investigation of map features. For example, a description of the sidewalk in relation to a nearby street may be a useful textual description, such as "NE of Main St." Can also be considered a flexible location to embed arbitrary information for specific use cases.
 */
export type Description = string;
/**
 * A field for the estimated incline over a particular path, i.e. slope, i.e. grade, i.e. rise over run. If derived from OpenStreetMap data, this is the maximum incline over the path. If derived from DEM data, it is more likely to be an underestimation. Positive values indicate an uphill climb while negative are downhill. For example, a 45 degree downhill value for incline would be -1.0.
 * @minimum -1.0
 * @maximum 1.0
 */
export type Incline = number;
/**
 * A field for the length of an edge in meters. This field is always inferred from the geometry.
 * @minimum 0
 * @maximum 5000
 */
export type Length = number;
/**
 * A field for a designated name for an edge. Example: an official name for a trail.
 */
export type Name = string;
/**
 * A field for the surface material of the path.
 */
export type Surface =
  | "asphalt"
  | "concrete"
  | "gravel"
  | "grass"
  | "paved"
  | "paving_stones"
  | "unpaved"
  | "dirt"
  | "grass_paver";
/**
 * A field for whether a curb ramp or edge has a tactile (textured) surface.
 */
export type TactilePaving = boolean;
/**
 * A field for width of an edge in meters.
 * @minimum 0
 * @maximum 500
 */
export type Width = number;
/**
 * A field for number of steps in stairs.
 * @minimum 0
 * @maximum 500
 */
export type StepCount = number;
/**
 * A field for the climb direction of steps.
 */
export type Climb =
  | "up"
  | "down";