# OpenSidewalks data schema

The OpenSidewalks data schema is an unofficial draft standard for mapping pedestrian
network information. It consists of data primitives, data definitions,
data interactions, and a concrete schema.

### Data primitives

Data primitives are the basic units used to derive the more complex data definitions
used by OpenSidewalks. They are exactly the same primitives used by OpenStreetMap.

### Data definitions

Data definitions are inspired by and usually compatible with the
OpenStreetMap project, with a primary goal of the OpenSidewalks schema to be fully
compatible with OpenStreetMap as quickly as possible (pending new tags acceptable to
the community).

### Data interactions

Data interactions refers to ways in which map data should be composed or collected:
the often-missing instructions on how to map several different elements of the
pedestrian network so that the data can be used in concert.

### The Schema

The schema defined by OpenSidewalks is an extension of the `OpenMapTiles` schema,
itself a simplification of OpenStreetMap tagging schemas. It uses the same licensing
terms: CC-BY.

## Data primitives

Pedestrian networks are graphical structures: they define not only the shape and
properties of pedestrian spaces, but how they connect to one another. OpenStreetMap
uses graph structures as its core elements of mapping and the OpenSidewalks standard
uses identical conventions for describing its data: nodes, ways, and tags.

### tags

Tags are key-value pairs used to annotate metadata about the other data primitives.
Both keys and values are typically textual, such as "subclass" and "footway" in the
`key=value` pair of `subclass=footway`. By convention, tags are referred to by their
parent `key=value` pairs, so to discuss footways one might start a topic on
`subclass=footway`.

Keys are an enum: they are pre-specified and only predefined keys should be used unless
the schema is being extended for local or research purposes. The vast majority of
values are also enums: prescribed categories of textual values. Some values may be
numeric, such as the width of a sidewalk.

Tags may follow nesting structures by conventions. For example, `subclass=footway`
defines a footway and `footway=sidewalk` designates that the type of footway is a
sidewalk. The strategy of reusing values as keys to further specify the category of
the primary tag is known as subtagging. Another nesting strategy is to use namespaces,
where colons are used to add additional information to a tag category. For example,
streets often have multiple forms of lane annotation: `lanes=3`, `lanes:forward=1`,
`lanes:backwards=2` would refer to a 3-lane street with two lanes in one direction
and two in the other, with direction of the way indicating forward vs. backward.

Tags must have these properties:

- a key
- a value

### nodes

Nodes are the most basic data primitive in the schema. They have geographical
coordinates (latitude, longitude), a unique identifier, and optionally one or more
tags.

Nodes must either be disconnected and tagged, as in the case for trees, or referred to
by at least one way, in which case tagging is optional.

Nodes must have these properties:

- A node identifier (ID).
- A latitude coordinate in WGS84.
- A longitude coordinate in WGS84.

Nodes may also have these properties:

- Any number of tags

### ways

Ways are the linear data structure for OpenSidewalks and are used to represent all
paths. Ways represent their geographical structures (lines, polygons) through
reference to an ordered set of `nodes` and tagging conventions.

Ways take on semantics for mapping through the addition of tags: all ways should have
at least one primary `subclass` tag.

Ways must have these properties:

- A way identifier (ID).
- An ordered set of node references (node IDs).
- A `subclass` tag.

## Data definitions

### subclasses / highways

This category derives from the OpenStreetMap "highway" convention and is the primary
signifier of all traversible paths. `highway` types are referred to using the
`subclass` layer. Pedestrians can use a wide range of `highways`, even if they are  not
the primary intended traffic, so several `subclasses` classes are defined for
OpenSidewalks:

- Streets for vehicles: streets where the primary traffic is vehicles like cars or
trucks.

- Pedestrian streets: streets where the primary traffic is intended to be pedestrians.

- Cycling paths: paths intended primarily for cyclists.

- Designated footways: foot paths and sidewalks.

The full set of tags that can be applied to designate `subclasses` is described in the
`subclass` field of the transportation layer.

#### subclasses as linear features

`subclasses` are usually linear features, similar to `LineStrings` in a GIS context or
`ways` in OpenStreetMap: their geometric or geographic representation refers to an
ordered set of coordinates, so they have both a shape and a direction along which they
are drawn: a start coordinate, an end coordinate, and intervening coordinates to
connect them.

#### Special case: subclasses as areas

Representing pedestrian spaces with polygonal data is less common, but still useful
data. Examples where this is currently widely appropriate are plazas and large
pedestrian streets. There is no standard approach by which these data are turned into
routable structures, however, so for mapping useful information we recommend
"double tagging": map areas and some canonical linear subclasses through them.

## Data interactions

### subclasses as routable (graph) features

When treated as a graphical representations, a linear `subclass` can be thought of as
its own small graph: the coordinates are nodes and connections between them are edges.
`nodes` will be referred to frequently in the OpenSidewalks schema, referring to unique
coordinates that may be part of a linear `subclass` and have unique properties (tags)
of their own.

To be meaningful for routing purposes, `subclasses` should be connected. When
represented by a graph data structure (as in OpenStreetmap), this means that every
`subclass` should share at least one coordinate pair (node) with another `subclass`,
ideally with coordinate pairs receiving a unique identifier (node reference). In a
routing context, `subclass` data structures will be split whenever an internal
coordinate is shared by another `highway`.

### Mapping pedestrian paths

### connecting subclasses with different intended forms of traffic

Pedestrians interface with `subclasses` that serve a variety of transportation options
as their primary traffic: pedestrians, cars, trucks, trains, and other large vehicles.
When pedestrian `subclasses` cross other `subclasses` on the same z-level, as in they
physically intersect one another, they should share a node.

## Schema Layers

### `transportation`

The transportation layer includes the entire pedestrian transportation network,
including primary pedestrian paths, mixed-use paths, and street paths as backup
infrastructure. All transportation layer elements are ways (LineStrings).

This layer extends the layer of the same name in the OpenMapTiles schema to include
more pedestrian-specific information.

#### Fields

##### `subclass`

*From OpenStreetMap*

The OpenStreetMap `highway=*` subclass of the displayed way. Many values are accepted,
enumerated below by primary intended use case.

###### *Enumerated values*:

###### `cyclists`:

- `cycleway`: a cycling path. May have `foot=yes` or `foot=no` to explicitly designate
  pedestrian access.

###### `pedestrians`:

- `footway`: a pedestrian path. Includes sidewalks and detached footways.
- `path`: a catch-all for paths. Note: may be deprecated in favor of less ambiguous
  tags.
- `pedestrian`: a pedestrian street or area. A road where pedestrians are the primary
  traffic and other traffic is limited or prohibited.
- `steps`: stairs.

###### `motor vehicles`:

- `secondary`
- `tertiary`
- `residential`
- `service`

There are plans to add `corridor` for indoor routing.

##### `footway`

*From OpenStreetMap*

The original value for `footway` on OpenStreetMap. This allows differentiation between
different classes of footway.

###### *Value type*: `enum`

###### *Enumerated values*:

- `crossing`: A street crossing
- `sidewalk`: A sidewalk
- `link` (experimental) A path linking primary ways, e.g. a sidewalk to a street
crossing.

##### `crossing`

*From OpenStreetMap*

Type of street crossing - marked or unmarked. When derived from OpenStreetMap data,
the `crossing` key undergoes various conversions due to fragmentation. Both the
`uncontrolled` and `zebra` values are converted into `marked` and the `traffic_signals`
value is ignored.

###### *Value type*: `enum`

###### *Enumerated values*:

- `marked`: a marked crossing
- `unmarked`: an unmarked crossing

##### `description`

*Unique to OpenSidewalks*

This may be a field inferred from other data.

A free form text field for describing a path. May be pre-encoded in relevant pedestrian
paths to assist with routing instructing or investigation of map features. For
example, a description of the sidewalk in relation to a nearby street may be a useful
textual description, such as "NE of Main St." Can also be considered a flexible
location to embed arbitrary information for specific usecases.

###### *Value type*: `text`

##### `name`

*From OpenStreetMap*

The (semi-)official name of a pathway. *Not* a description of the path. For example,
this would be the street name for a street path or a specially-designated name for a
famous footpath.

###### *Value type*: `text`

##### `kerb_raised`

*Unique to OpenSidewalks*

This is an inferred quantity based on either network analysis or spatial proximity of
a crossing to lowered curbs, and should be interpreted as indicating that using this
path requires crossing over a raised curb interface. This quantity is useful for
visualization - which paths required traversing a curb?

###### *Value type*: `enum`

###### *Enumerated values*:

- `1`
- `0`

##### `car_speed`

*Unique to OpenSidewalks*

This is an inferred quantity based on either network analysis or spatial proximity of
a sidewalk to a nearby road, and should be interpreted as indicating that using this
path a pedestrian may be adjacent to vehicles traveling at the speed indicated. 
This quantity is useful for visualization or in the scoring of Level of Traffic Stress 
experienced by pedestrians or bicyclists traveling along this sidewalk.

###### *Value type*: `numeric`

##### `incline`

*From OpenStreetMap*

The estimated incline over a particular path, i.e. slope, i.e. grade, i.e. rise over
run. If derived from OpenStreetMap data, this is the maximum incline over the path. If
derived from DEM data, it is more likely to be an underestimation. Positive values
indicate an uphill climb while negative are downhill. For example, a 45 degree
downhill value for `incline` would be -1.0.

###### *Value type*: `numeric`

##### `surface`

*From OpenStreetMap*

The surface material of the path. Derived directly from the `surface` tag from
OpenStreetMap.

###### *Value type*: `enum`

###### *Enumerated values*:

- `asphalt`
- `concrete`
- `gravel`
- `grass`
- `paved`
- `paving_stones`
- `unpaved`

##### `length`

*From OpenStreetMap*

This is the calculated length of the way, in meters, according to the Haversine
formula (Great-Circle Distance). This calculation is typically left up to consumers of
geometry data, as the geometry is, itself, furnished for geometrical analysis. This
is likely how AccessMap should also handle these data, but for now `length` is
precalculated.

###### *Value type*: `numeric`

##### `foot`

*From OpenStreetMap*

Original value of the `foot` key if it is set to yes or no.

###### *Value type*: `enum`

###### *Enumerated values*:

- `1`
- `0`

##### `opening_hours`

*From OpenStreetMap*

The opening hours of the network element. This may apply to, for example, a path that
is inside a building. The value is in OpenStreetMap syntax for the `opening_hours` tag.

###### *Value type*: `opening_hours`

##### `elevator`

*Unique to OpenSidewalks*

Whether the path uses an elevator for vertical movement, e.g. building paths.

###### *Value type*: `boolean`

###### *Enumerated values*:

- `1`
- `0`

##### `width`

*From OpenStreetMap*

The with of the path in meters.

###### *Value type*: `numeric`

##### `layer`

*From OpenStreetMap*

The relative z-order of map elements. Useful for both rendering and detecting
spatial intersections - paths of different `layer` values can intersect without
sharing a node. Values are integers that can be negative (for underground), with the
implied default being `layer=0`.

###### *Value type*: `integer`

##### `service`

*From OpenStreetMap*

Service ways, usually for mixed traffic. This includes driveways, parking lots, and
alleys.

###### *Value type*: `enum`

###### *Enumerated values*:

- `alley`
- `driveway`
- `parking_aisle`

##### `brunnel`

*From OpenStreetMap*

A tag indicating that a path is part of a bridge, tunnel, or ford.

###### *Value type*: `enum`

###### *Enumerated values*:

- `bridge`
- `ford`
- `tunnel`

##### `indoor`

*From OpenStreetMap*

Whether the pathway is indoor or not.

###### *Value type*: `boolean`

###### *Enumerated values*:


- `1`
- `0`

#### Experimental Fields

##### `smoothness` (experimental)

*From OpenStreetMap*

A (currently subjective) classification scheme regarding the smoothness of a path for
use by wheeled devices.

###### *Value type*: `enum`

###### *Enumerated values*:

- `excellent`
- `good`
- `intermediate`
- `bad`

##### `ramp` (experimental)

A dedicated pedestrian ramp feature, such as a wheelchair ramp. The schema for this
tag is highly experimental and subject to change.

###### *Value type*: `enum`

###### *Enumerated values*:

- `1`: indicates the presene of a ramp.
- `0`: not a ramp. Only for use when a ramp might be implied by other tags.
- `wheelchair`: a designated wheelchair ramp.

##### `level` (experimental)

*From OpenStreetMap*

The building level with which a path is associated. For example, a path on a large
patio of a building. Can be any integer value that exists for an associated building.

###### *Value type*: `integer`

##### `intersection_type` (experimental)

*Unique to OpenSidewalks*

This is intended to be an inferred property, not directly mapped.

The type of intersection with which a network element is associated.

###### *Value type*: `enum`

###### *Enumerated values*:

- `roundabout`: this path is associated with a roundabout-style intersection

### `barrier`

This layer contains potential barriers along the pedestrian transportation network.
They should share a node with at least one pathway in the `transportation` layer. All
`barrier` layer features are node (Point) data.

#### Fields

##### `barrier`

A physical structure which blocks or impedes movement.

###### *Value type*: `enum`

###### *Enumerated values*:

- `kerb`

##### `kerb`

*From OpenStreetMap*

The value of the original kerb tag.

###### *Value type*: `enum`

###### *Enumerated values*:

- `flush`
- `lowered`
- `raised`
- `rolled`

##### `tactile_paving`

*From OpenStreetMap*

The value of the original `tactile_paving` tag.

###### *Value type*: `boolean`

###### *Enumerated values*:

- `1`
- `0`

### `buildings`

This layer contains building polygons and related metadata.

#### Fields

##### `building`

*From OpenStreetMap*

The particular type of building. If no particular type is specified, any polygon in
this layer is implied to be a building, i.e. `building=yes` in OpenStreetMap.

###### *Value type*: `enum`

###### *Enumerated values*:

- `apartments`
- `commercial
- `hotel`
- `house`
- `residential`

- `church`
- `mosque`
- `synagogue`
- `temple`

##### `opening_hours`

*From OpenStreetMap*

The opening hours of the building. The value is in OpenStreetMap syntax for the
`opening_hours` tag.

###### *Value type*: `opening_hours`


### `points` (experimental)

This layer is an experimental dumping ground for currently uncategorized point data.
Features and tags defined in this layer will be placed in new, semantically-consistent
layers are the schema is further developed.

#### Fields

##### `amenity`

*From OpenStreetMap*

Point features serving particular functional purposes.

###### *Value type*: `enum`

###### *Enumerated values*:

- `bench`
- `drinking_water`
- `fountain`
- `telephone`
- `waste_basket`

##### `power`

*From OpenStreetMap*

A power pole.

###### *Value type*: `enum`

###### *Enumerated values*:

- `pole`

##### `public_transport`

*From OpenStreetMap*

A public transit pole, such as a bus stop sign.

###### *Value type*: `enum`

###### *Enumerated values*:

- `pole`

##### `emergency`

*From OpenStreetMap*

A fire hydrant.

###### *Value type*: `enum`

###### *Enumerated values*:

- `fire_hydrant`
