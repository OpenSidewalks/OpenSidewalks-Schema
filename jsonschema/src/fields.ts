/**
 * A field that indicates whether an entity is on a bridge, tunnel, or ford.
 */
export type Brunnel = "bridge" | "ford" | "tunnel";
/**
 * A field for the type of street crossing - marked or unmarked. When derived from OpenStreetMap data, the crossing key undergoes various conversions due to fragmentation. Both the uncontrolled and zebra values are converted into marked and the traffic\_signals value is ignored.
 */
export type CrossingMarkings = "yes" | "no" | "surface" | "lines" | "lines:paired" | "dashes" | "dots" | "zebra" | "zebra:double" | "zebra:paired" | "zebra:bicolour" | "ladder" | "skewed" | "ladder:paired";

/**
 * A free form text field for describing an edge of node. May be pre-encoded in relevant pedestrian paths to assist with routing instructing or investigation of map features. For example, a description of the sidewalk in relation to a nearby street may be a useful textual description, such as "NE of Main St." Can also be considered a flexible location to embed arbitrary information for specific use cases.
 */
export type Description = string;
/**
 * A field for whether an edge uses an elevator for vertical movement, e.g. building
paths.
 */
export type Elevator = boolean;
/**
 * A field that indicates whether an edge can be used by pedestrians. Is implied for a Footway entity and its subtypes.
 */
export type Foot = boolean;
/**
 * A field for the estimated incline over a particular path, i.e. slope, i.e. grade, i.e. rise over run. If derived from OpenStreetMap data, this is the maximum incline over the path. If derived from DEM data, it is more likely to be an underestimation. Positive values indicate an uphill climb while negative are downhill. For example, a 45 degree downhill value for incline would be -1.0.
 * @minimum -1.0
 * @maximum 1.0
 */
export type Incline = number;
/**
 * A field that indicates whether an edge is indoors.
 */
export type Indoor = boolean;
/**
 * A field that indicates the z-layer (integer) on which an edge lies. If unset, a value of 0 is implied. Negative values are allowed.
 * @TJS-type integer
 * @minimum -10
 * @maximum 10
 */
export type Layer = number;
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
 * A field for the opening hours of an entity: whether it is available at a given time. An edge through a building that closes at night, for example, may have this field. The value is in OpenStreetMap syntax for the opening\_hours tag. See [OpenStreetMap specification](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification) on the formatting for this field.
 */
export type OpeningHours = string;
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
  | "unpaved";
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
