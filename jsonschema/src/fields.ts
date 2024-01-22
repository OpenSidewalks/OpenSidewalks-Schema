/**
 * A field for markings on the ground which are meant to draw attention to the area where pedestrians are to cross the road.
 */
export type CrossingMarkings =
| "dashes"
| "dots"
| "ladder"
| "ladder:paired"
| "lines"
| "lines:paired"
| "no"
| "skewed"
| "surface"
| "yes"
| "zebra"
| "zebra:bicolour"
| "zebra:double"
| "zebra:paired"
| "rainbow"
| "lines:rainbow"
| "zebra:rainbow"
| "ladder:skewed"
| "pictograms";
/**
 * A free form text field for describing an entity. May be pre-encoded in relevant pedestrian paths to assist with routing instructing or investigation of map features. For example, a description of the sidewalk in relation to a nearby street may be a useful textual description, such as "NE of Main St." Can also be considered a flexible location to embed arbitrary information for specific use cases.
 */
export type Description = string;
/**
 * A field for the estimated incline over a particular path, i.e. slope, i.e. grade, i.e. rise over run. If derived from OpenStreetMap data, this is the maximum incline over the path. If derived from DEM data, it is more likely to be an underestimation. Positive values indicate an uphill climb while negative are downhill. For example, a 45 degree downhill value for incline would be -1.0. For steps, you can use "up" or "down" to indicate the direction of the climb.
 * @minimum -1.0
 * @maximum 1.0
 */
export type Incline =
  | number
  | "up"
  | "down";
/**
 * A field for the length of an entity in meters. This field is always inferred from the geometry.
 * @minimum 0
 * @maximum 5000
 */
export type Length = number;
/**
 * A field for a designated name for an entity. Example: an official name for a trail.
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
 * A field for whether a curb has a tactile (textured) surface. Tactile paving is a system of textured ground surface indicators found on footpaths, stairs and public transportation platforms to assist pedestrians who are blind or visually impaired. A tactile paving area has a surface that is easy to detect using a long cane, typically because it is rougher than the surrounding surface area or has an embossed pattern.
 */
export type TactilePaving =
| "yes"
| "no"
| "contrasted"
| "primitive"
| "incorrect"
| "partial";
/**
 * A field for width of an entity in meters.
 * @minimum 0
 * @maximum 500
 */
export type Width = number;
/**
 * A field for number of steps in stairs.
 * @minimum 0
 * @maximum 500
 * @TJS-type integer
 */
export type StepCount = number;
/**
 * A field that indicates whether an edge can be used by pedestrians.
 */
export type Foot =
 | "yes"
 | "no"
 | "designated"
 | "permissive"
 | "use_sidepath"
 | "private"
 | "destination";
/**
 * A field for markings a given object as a building.
 */
export type BuildingField =
| "apartments"
| "barracks"
| "bungalow"
| "cabin"
| "detached"
| "dormitory"
| "farm"
| "ger"
| "hotel"
| "house"
| "houseboat"
| "residential"
| "semidetached_house"
| "static_caravan"
| "stilt_house"
| "terrace"
| "tree_house"
| "trullo"
| "commercial"
| "industrial"
| "kiosk"
| "office"
| "retail"
| "supermarket"
| "warehouse"
| "cathedral"
| "chapel"
| "church"
| "kingdom_hall"
| "monastery"
| "mosque"
| "presbytery"
| "religious"
| "shrine"
| "synagogue"
| "temple"
| "bakehouse"
| "bridge"
| "civic"
| "college"
| "fire_station"
| "government"
| "gatehouse"
| "hospital"
| "kindergarten"
| "museum"
| "public"
| "school"
| "toilets"
| "train_station"
| "transportation"
| "university"
| "barn"
| "conservatory"
| "cowshed"
| "farm_auxiliary"
| "greenhouse"
| "slurry_tank"
| "stable"
| "sty"
| "livestock"
| "grandstand"
| "pavilion"
| "riding_hall"
| "sports_hall"
| "sports_centre"
| "stadium"
| "allotment_house"
| "boathouse"
| "hangar"
| "hut"
| "shed"
| "carport"
| "garage"
| "garages"
| "parking"
| "digester"
| "service"
| "tech_cab"
| "transformer_tower"
| "water_tower"
| "storage_tank"
| "silo"
| "beach_hut"
| "bunker"
| "castle"
| "construction"
| "container"
| "guardhouse"
| "military"
| "outbuilding"
| "pagoda"
| "quonset_hut"
| "roof"
| "ruins"
| "tent"
| "tower"
| "windmill"
| "yes";
/**
 * A field for the opening hours of an entity. The value is in OpenStreetMap syntax for the opening_hours tag. See [OpenStreetMap specification](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification) on the formatting for this field.
 */
export type OpeningHours = string;
/**
 * A field for the schema version.
 */
export type SchemaVersion = `${number}.${number}`;
/**
 * A field for the schema id.
 */
export type SchemaID = `https://sidewalks.uw.edu/opensidewalks/${SchemaVersion}/schema.json`;