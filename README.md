*The OpenSidewalks Schema*
========================

# Introduction

The OpenSidewalks Schema is a proposed open pedestrian transportation
network data standard for describing and sharing pedestrian network and
pedestrian network-adjacent data. The OpenSidewalks Schema promotes an
explicit network (graph) model wherein its primary data entities can be
deterministically transformed into graph edges and graph nodes.
Therefore, OpenSidewalks Schema data represent a traversable and
graph-analyzable network of (conditional) pedestrian paths like
sidewalks, street crossings, some streets, and other paths, as well as
metadata representing potential barriers.

The OpenSidewalks Schema is explicitly a network schema: its primary features
are defined and interpreted as elements of a network (or graph), i.e. nodes
and edges. Therefore, OpenSidewalks Schema data are understood not only as
a set of features describing pedestrian infrastructure, but as *connected
elements* of a pedestrian network.

The OpenSidewalks Schema draws from and is intended to be largely
compatible with OpenStreetMap data, though it is possible to create
OpenSidewalks Schema data not derived from OpenStreetMap.

## OpenSidewalks Schema Entities

### Overview

The OpenSidewalks Schema defines network and non-network data using a
set of vector geometrical entity types, each of which having an
associated geometry type compatible with either the Point or LineString
specification of [Simple Feature Access](https://www.ogc.org/standards/sfa),
fields that uniquely define the entity type (in combination),
optional topological information, and optional key-value pair [metadata
fields](#fields) defined on a per-type
basis.

There are currently three major categories of entity models:
- Nodes
- Edges
- Points

Nodes and Edges are geometrical features (OGC Points and LineStrings,
respectively) with network primitives defined such that a network (or graph)
can be constructed purely from their metadata. Points are solely geometrical
OGC Point features and they lack network metadata: their relationship to other
members of the dataset are spatial. Examples of each entity model:

- Node: a raise curb.
- Edge: a sidewalk.
- Point: a fire hydrant.

Every entity has a set of defining attributes:

- *identifying fields* that must be matched to infer the entity type.
- *optional fields* that describe additional attributes of the entity.
- *geometry type* that define the OGC geospatial type of the feature.

#### Nodes

[Nodes](#nodes) are point features that also contain metadata to identify them
as network (graph) vertices. Currently, this means that they must have a unique
(within the dataset) `_id` field. Therefore, the set of network vertices in
the dataset could be summarized as a set of these `_id` field values,
consistent with the definition verticies within a graph in graph theory. As
a result of storing these vertex identifiers, Nodes may be placed within a
traversable graph using only metadata, not spatial inference.

#### Edges

[Edges](#edges) are linear features that also contain metadata to identify
them as network (graph) edges. Currently, this means that they must have two
node-referencing fields: `_u_id` and `_v_id`, which mean "this linear feature
begins at the Node with `_id` of `_u_id` and ends at the Node with `_id` of
`_v_id`. Therefore, a network (graph) may be constructed from a set of Nodes
and Edges directly from metadata.

Note that Edges are directional features: the start at one node and end at one
node. The data they represent is directional as well: their geospatial data
must start at one location and end at another and Edges often have fields like
`incline` that only have meaning when direction is understood: a positive
incline value is uphill while a negative incline value is downhill. However,
this does not mean that datasets must be curated with both "forward" (`u` to
`v`) Edges and "reverse" (`v` to `u`) Edges: any "reverse" edge can be
inferred during graph creation.

#### Points

[Points](#points) are point features that do not contain network metadata, i.e.
they do not have `_id` fields. These are features relevant to the pedestrian
network that are nevertheless not (yet) represented as elements of it: they are
nearby and useful for producing descriptions, flagging potential barriers, etc.

### Entity type inference

Intended to closely mirror OpenStreetMap entities, OpenSidewalk Schema entities
are identified by their set of fields. Fields that uniquely identify an entity
type are called *identifying fields*. In most cases, if an entity has all of
the *identifying fields* specified, its type is matched. The only exception is
for entities whose *identifying fields* are also a subset of other entities'
*identifying fields*, in which case they are identified by (1) having all of
the *identifying fields* listed but also *not* any of the *identifying fields*
of subtypes.

### Metadata fields

The optional metadata [fields](#fields)
that may be populated for OpenSidewalks Schema entities are largely
inspired by and compatible with (reading from) OpenStreetMap data.
OpenStreetMap-derived fields represent a standardized and constrained
interpretation of OpenStreetMap tags that often represent boolean values
as yes/no strings, have unclear enumerated value tags, or allow the use
of many different units for distances (e.g., a path's width may be
described in meters, centimeters, feet, or other units in
OpenStreetMap). The standardization of field types is itself inspired by
the OpenMapTiles standard, which is optimized for protobuf-based
serialization.

The combination of metadata standardization and network structures make
OpenSidewalks data machine-readable and amenable to standardized
analysis pipelines.

Additional information on field types can be found in the [overview
subsection](#fields-overview) of the fields section.

### Network topologies

The OpenSidewalks Schema includes network topological rules for the ways
in which network-mappable entities can be connected.

#### Edge entities only connect end-to-end

While a graph structure may be inferred from Edges via their endpoints, the use
of `_u_id` and `_v_id` are preferred. However, Edge entities should still meet
end-to-end (within some small marging of error), as they are intended to
represent a physically-connected space.

Similarly, no connection is implied when the linear geometries of Edges cross.
Instead, this represents one of two scenarios:

1. The Edges have different `layer` values, i.e. they are at different vertical
levels and so are not connected.

2. There is a data error: the linear features are meant to meet where they
intersect but the data maintainers have made a mistake. One way to infer this
is when the intersecting linear features' `layer` values match (either
because they are undefined and implicitly `layer=0` or have explicitly-defined
matchin values).

#### A road entity and a Crossing that intersects with it should share a location/node

In addition to the above rule about entities connecting end-to-end, it
is considered incorrect for a street crossing to intersect with (cross)
associated road entities. Instead, both the road and crossing entities
should be split such that endpoints are shared.

#### Crossings do not connect to sidewalk centerlines

The OpenSidewalks Schema defines [Crossings](#edge-crossing) as
existing only on the street surface and
[Sidewalks](#edge-sidewalk) as describing only
the sidewalk centerline. There must therefore always be space between a
Sidewalk and a Crossing. A Sidewalk and Crossing should be connected by
a plain [Footway](#edge-footway).

#### Curb interfaces and curb ramps are mapped at Edge endpoints

Curb interface Points should be mapped directly at the endpoint(s) of
one or more Edge(s): they are potential barriers or accessible infrastructure
encountered along a path, so they should be available for inspection during
network traversals. In other words, they are often important decision points
when simulating a pedestrian moving through the network.

## Serialization Formats

OpenSidewalks data entities are vector geometries with optional
topological data along with metadata that defines the entity type and
optional metadata fields that are mappable to non-nested key-value
pairs. As such, OpenSidewalks Schema data can be (de)serialized into a
number of tabular and non-tabular GIS and graph formats. There exists
both a [reference JSON Schema for a GeoJSON
serialization](./opensidewalks.schema.json) codebase for the OpenSidewalks
Schema as well as a PostgreSQL schema.

# <a name="list-of-entities"></a> List of Entities

## <a name="nodes"></a> Nodes

Nodes are features that are geometrically defined by a single
latitude-longitude pair: a point on the planet. They are also defined as a
part of a pedestrian network: each Node must define an `_id` string field, a
unique identifier to which Edges may refer using their `_u_id` and `_v_id`
fields.

### <a name="node-bare_node"></a> Bare Node

#### Description

A special case of an abstract Node: this is a network (graph) node description
that does not have any special metadata beyond location and the `_id` field. A
"bare node" exists when two Edges meet at a location that is not one of the
other Node types. For example, a single sidewalk may be represented by two
[Sidewalk](edge-sidewalk) Edges with different `width` values, split where the
width changes. There is no physical feature within the OpenSidewalks Schema at
that split point: it is just a "bare node" that connects the two Edges
together.

Another way to interpret a "bare node" is in terms of the Edge definition
rules: the Nodes referenced by `_u_id` and `_v_id` must exist within the
dataset, so we must define Nodes wherever Edges meet regardless of whether that
point in space has additional metadata.

#### Subtype of

*None*

#### Geometry

Point

#### Identifying fields

(must have the `_id` field, like all Nodes)

#### Optional Fields

*None*

### <a name="node-raised_curb"></a> Raised curb

#### Description

A single, designed vertical displacement that separates two Edges. A
common example is the curb that separates a street crossing from a
sidewalk. This is mapped at the Node where the two Edges meet - on top
of the curb is physically located.

#### Subtype of

*None*

#### Geometry

Point

#### Identifying fields

`barrier=kerb, kerb=raised`

#### Optional Fields

[layer](#field-layer)

[brunnel](#field-brunnel)

### <a name="node-rolled_curb"></a> Rolled curb

#### Description

A curb interface with a quarter-circle profile: traversing this curb is
like going over half of a bump. Located where two Edges meet,
physically at the location of the curb itself.

#### Subtype of

*None*

#### Geometry

Point

#### Identifying fields

`barrier=kerb, kerb=rolled`

#### Optional Fields

[layer](#field-layer)

[brunnel](#field-brunnel)

### <a name="node-curb_ramp"></name> Curb ramp

#### Description

A curb ramp (curb cut) mapped as a curb interface. Mapped at the
location where the two Edges that it connects meet one another.

#### Subtype of

*None*

#### Geometry

Point

#### Identifying fields

`barrier=kerb, kerb=lowered`

#### Optional Fields

[layer](#field-layer)

[brunnel](#field-brunnel)

[surface](#field-surface)

[tactile\_paving](#field-tactile_paving)

### <a name="node-flush_curb"></a> Flush curb

#### Description

An indicator that there is no raised curb interface where two Edges meet
- i.e. where someone might expect a curb interface, such as where a
crossing and footway meet.

#### Subtype of

*None*

#### Geometry

Point

#### Identifying fields

`barrier=kerb, kerb=lowered`

#### Optional Fields

[layer](#field-layer)

[brunnel](#field-brunnel)

## <a name="edges"></a> Edges

Edges are lines (their serializable geometries are representable by
LineStrings) intended to represent pedestrian network connections. Edges are
often derived from topological data like that stored in OpenStreetMap.

All Edges may use the [layer](#field-layer) and [brunnel](#field-brunnel) tags,
as all pedestrian paths may overlap one another at different z-levels or be
part of a bridge or tunnel.

### <a name="edge-footway"></a> Footway (plain)

#### Description

The centerline of a dedicated pedestrian path that does not fall into
any other subcategories.

#### Subtype of

*None*

#### Geometry

LineString

#### Identifying fields

`highway=footway`

*(and no `footway=\*` subtag)*

#### <a name="edge-footway-optional-fields"></a> Optional Fields

[width](#field-width)

[surface](#field-surface)

[incline](#field-incline)

[length](#field-length)

[layer](#field-layer)

[brunnel](#field-brunnel)

[description](#field-description)

[name](#field-name)

### <a name="edge-sidewalk"></a> Sidewalk

#### Description

The centerline of a sidewalk, a designated pedestrian path to the
side of a street.

#### Subtype of

[Footway](#edge-footway)

#### Geometry

LineString

#### Description

A dedicated pedestrian path (footway) along one side of the road.

#### Identifying fields

`highway=footway, footway=sidewalk`

#### Optional Fields

All [optional fields of footway](#edge-footway-optional-fields)

[description](#field-description):
Sidewalk-specific usage note: OpenSidewalks data will often infer a
'description' property that states where the sidewalk is in relation to
its associated street. Example: "NW side of 5th Ave".

### <a name="edge-crossing"></a> Crossing

#### Description

(Part of) the centerline of a pedestrian street crossing. A crossing exists
only on the road surface itself, i.e. "from curb to curb".

Because crossings should be connected to the street network, they should be
represented by at least two Edges: one from the first curb interface to the
street centerline and one from the street centerline to the second curb
interface, e.g..

Crossings should not be connected directly to sidewalk centerlines, as the
sidewalk centerline is never the curb interface. Instead, a short footway
should connect the two together.

#### Subtype of

[Footway](#edge-footway)

#### Geometry

LineString

#### Identifying fields

`highway=footway, footway=crossing`

#### Optional Fields

All [optional fields of footway](#edge-footway-optional-fields)

[crossing](#field-crossing)

### <a name="edge-traffic_island"></a> Traffic Island

#### Description

The centerline of a footway traversing a traffic island. Some complex,
long, or busy pedestrian crossings have a built-up "island" to protect
pedestrians, splitting up the crossing of the street into two or more
crossings. As a pedestrian uses this crossing, they will transition
across these Edge elements: sidewalk → footway → crossing → traffic island →
crossing → footway → sidewalk.

#### Subtype of

[Footway](#edge-footway)

#### Geometry

LineString

#### Identifying fields

`highway=footway, footway=traffic\_island`

#### Optional Fields

All [optional fields of footway](#edge-footway-optional-fields)

### <a name="edge-cycleway"></a> Cycleway

#### Description

The centerline of a designated cycling path. This path may or may
not permit pedestrian use.

#### Subtype of

*None*

#### Geometry

LineString

#### Identifying fields

`highway=cycleway`

#### Optional Fields

[width](#field-width)

[surface](#field-surface)

[incline](#field-incline)

[length](#field-length)

[layer](#field-layer)

[brunnel](#field-brunnel)

[description](#field-description)

[name](#field-name)

[foot](#field-foot)

### <a name="edge-primary_street"></name> Primary Street

#### Description

The centerline of a major highway.

#### Subtype of

*None*

#### Geometry

LineString

#### Identifying fields

`highway=primary`

#### <a name="edge-primary_street-optional-fields"></a> Optional Fields

[width](#field-width)

[surface](#field-surface)

[incline](#field-incline)

[length](#field-length)

[layer](#field-layer)

[brunnel](#field-brunnel)

[description](#field-description)

[name](#field-name)

[foot](#field-foot)

### <a name="edge-secondary_street"></a> Secondary Street

#### Description

The centerline of a secondary highway: not a major highway, but forms a
major link in the national route network.

#### Subtype of

*None*

#### Geometry

LineString

#### Identifying fields

`highway=secondary`

#### Optional Fields

All of [the optional fields of a primary
street](#edge-primary_street-optional-fields).

### <a name="edge-tertiary_street"></a> Tertiary Street

#### Description

A road linking small settlements, or the local centers of a large town
or city.

#### Subtype of

*None*

#### Geometry

LineString

#### Identifying fields

`highway=tertiary`

#### Optional Fields

All of [the optional fields of a primary
street](#edge-primary_street-optional-fields).

### <a name="edge-residential_street"></a> Residential Street

#### Description

A residential street.

#### Subtype of

*None*

#### Geometry

LineString

#### Identifying fields

`highway=residential`

#### Optional Fields

All of [the optional fields of a primary
street](#edge-primary_street-optional-fields).

### <a name="edge-service_road"></a> Service Road

#### Description

A road intended for service use.

#### Subtype of

*None*

#### Geometry

LineString

#### Identifying fields

`highway=service`

#### <a name="edge-service_road-optional-fields"></a> Optional Fields

[width](#field-width)

[surface](#field-surface)

[incline](#field-incline)

[length](#field-length)

[layer](#field-layer)

[brunnel](#field-brunnel)

[description](#field-description)

[foot](#field-foot)

### <a name="edge-driveway"></a> Driveway

#### Description

The centerline of a driveway. Typically connects a residence or business
to another road.

#### Subtype of

[Service road](#edge-service_road)

#### Geometry

LineString

#### Identifying fields

`highway=service, service=driveway`

#### Optional Fields

All of [the optional fields of a service
road](#edge-service_road-optional-fields).

### <a name="edge-alley"></a> Alley

#### Description

The centerline of an alley. An alley is usually located between
properties and provides access to utilities and private entrances.

#### Subtype of

[Service road](#edge-service_road)

#### Geometry

LineString

#### Identifying fields

`highway=service, service=alley`

#### Optional Fields

All of [the optional fields of a service
road](#edge-service_road-optional-fields).

### <a name="edge-parking_aisle"></a> Parking aisle

#### Description

The centerline of a subordinated way in a parking lot: vehicles drive on
parking aisles to reach parking spaces in a parking lot.

#### Subtype of

[Service road](#edge-service_road)

#### Geometry

LineString

#### Identifying fields

`highway=service, service=parking\_aisle`

#### Optional Fields

All of [the optional fields of a service
road](#edge-service_road-optional-fields).

## <a name="points"></a> Points

Points are features that are geometrically defined by a single
latitude-longitude pair: a point on the planet. They are explicitly not
elements of the pedestrian network definition (i.e. the graph structure
described by Nodes and Edges), but they are still highly relevant to the
physical pedestrian network. Points may be considered part of the real physical
pedestrian network, but aren't appropriate as elements of the network
described by the OpenSidewalks Schema.

### <a name="point-power_pole"></a> Power pole

#### Description

A power pole. Often made of wood or metal, they hold power lines.

#### Subtype of

*None*

#### Geometry

Point

#### Identifying fields

`power=pole`

#### Optional Fields

[layer](#field-layer)

[brunnel](#field-brunnel)

### <a name="point-fire_hydrant"></a> Fire hydrant

#### Description

A fire hydrant - where fire response teams connect high-pressure hoses.

#### Subtype of

*None*

#### Geometry

Point

#### Identifying fields

`emergency=fire\_hydrant`

#### Optional Fields

*None*

# <a name="fields"></a> Fields

## <a name="fields-overview"></a> Overview

OpenSidewalks Schema fields are typed key-value pairs. Keys are always strings
(or symbols) and values can be any of a specific set. Value types include:

- `boolean`: `true` or `false`

- `text`: unlimited length string

- `enum` (a set of enumerated values designated by strings)

- `integer`: an integer

- `numeric`: an number, either integer or decimal

- `opening_hours`: serialized as a string, a specialized format for describing
when a facility or asset is "open", as in accessible to the public.

## List of fields

##### <a name="field-description"></a> description

*From OpenStreetMap*

This may be a field inferred from other data.

A free form text field for describing an Edge. May be pre-encoded in
relevant pedestrian Edges to assist with routing instructing or
investigation of map features. For example, a description of the
sidewalk in relation to a nearby street may be a useful textual
description, such as "NE of Main St." Is a means by which to provide a short
(1-3 sentences) textual description of information that's not directly
available in the schema. Example: "this path is muddy when wet." Note that
because `description` data are unstructured, they can only be interpreted one
at a time by individual people and should not be considered a dumping ground
for "extra data".

###### *Value type*: text

##### <a name="field-name"></a> name

*From OpenStreetMap*

The (semi-)official name of a path, of which an Edge is a part. *Not* a
description of the path. For example, this would be the street name for a
street path or a specially-designated name for a famous footpath.
`name="The \[X\] trail"`, for example.

###### *Value type*: text

##### <a name="field-incline"></a> incline

*From OpenStreetMap*

The estimated incline over a particular path, i.e. slope, i.e. grade,
i.e. rise over run. If derived from OpenStreetMap data, this is the
maximum incline over the path. If derived from DEM data, it is more
likely to be an underestimation. Positive values indicate an uphill
climb while negative are downhill. For example, a 45 degree downhill
value for incline would be -1.0.

###### *Value type*: numeric

##### <a name="field-surface"></a> surface

*From OpenStreetMap*

The surface material of the path. Derived directly from the surface tag
from OpenStreetMap.

###### *Value type*: enum

###### *Enumerated values*:

-   asphalt

-   concrete

-   gravel

-   grass

-   paved

-   paving\_stones

-   unpaved

##### <a name="field-length"></a> length

*From OpenStreetMap*

This is the calculated length of the way, in meters, according to the
Haversine formula (Great-Circle Distance). This calculation is typically
left up to consumers of geometry data, as the geometry is, itself,
furnished for geometrical analysis. This is likely how AccessMap should
also handle these data, but for now length is precalculated.

###### *Value type*: numeric

##### <a name="field-foot"></a> foot

*From OpenStreetMap*

Original value of the foot key if it is set to yes or no.

###### *Value type*: enum

###### *Enumerated values*:

-   1

-   0

##### <a name="field-opening_hours"></a> opening\_hours

*From OpenStreetMap*

The opening hours of the network element. This may apply to, for
example, a path that is inside a building. The value is in OpenStreetMap
syntax for the opening\_hours tag. See [OpenStreetMap
specification](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification)
on the formatting for this field.

###### *Value type*: opening\_hours

##### <a name="field-elevator"></a> elevator

*Unique to OpenSidewalks*

Whether an Edge uses an elevator for vertical movement, e.g. building
paths.

###### *Value type*: boolean

##### <a name="field-width"></a> width

*From OpenStreetMap*

The width of an Edge in meters.

###### *Value type*: numeric

##### <a name="field-layer"></a> layer

*From OpenStreetMap*

The relative z-order of map elements. Useful for both rendering and
detecting spatial intersections - paths of different layer values can
intersect without sharing a node. Values are integers that can be
negative (for underground), with the implied default being layer=0.

###### *Value type*: integer

##### <a name="field-brunnel"></a> brunnel

*From OpenStreetMap*

A field indicating that an entity is part of a bridge, tunnel, or ford.

###### *Value type*: enum

###### *Enumerated values*:

-   bridge

-   ford

-   tunnel

##### <a name="field-indoor"></a> indoor

*From OpenStreetMap*

Whether an entity is indoors or not.

###### *Value type*: boolean

##### <a name="field-tactile_paving"></a> tactile\_paving

*From OpenStreetMap*

Whether a curb ramp or Edge has a tactile (textured) surface.

###### *Value type*: boolean

##### <a name="field-crossing"></a> crossing

From OpenStreetMap

Type of street crossing - marked or unmarked. When derived from
OpenStreetMap data, the crossing key undergoes various conversions due
to fragmentation. Both the uncontrolled and zebra values are converted
into marked and the traffic\_signals value is ignored.

###### *Value type*: enum

###### *Enumerated values*:

-   marked: a marked crossing

-   unmarked: an unmarked crossing
