*The OpenSidewalks Schema*
========================

# Introduction

The OpenSidewalks Schema is a proposed open pedestrian transportation
network data standard for describing and sharing pedestrian network and
pedestrian network-adjacent data. The OpenSidewalks Schema promotes an
explicit network (graph) model wherein its primary data entities can be
deterministically transformed into graph edges and graph nodes.
Therefore, OpenSidewalks Schema data represent a traversable and
graph-analyzable network of (conditional) pedestrian pathways like
sidewalks, street crossings, some streets, and other paths, as well as
metadata representing potential barriers.

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
basis. Each entity may optionally have an identifier (*id* string field)
that must be unique within a given dataset.

There are currently two major categories of entity models, broken down
by geometry type: one for Pathways, which are linear network features,
and one for Points, which are point features, some of which map directly
to network elements (such as curbs and curb ramps) and some of which
intentionally separate from the network (such as fire hydrants).

All entities have a geometry type, a set of *identifying fields* that
must be matched to infer the entity type, and optional fields, which are
typed properties defined in the
[Fields](#fields) section.

### Network entities

The [Pathway entity](#pathways) model defines linear
features that are intended to meet end-to-end as a pedestrian network.
All Pathways are network elements and can be thought of as edge
descriptions. Inferring a network from a set of Pathways may be done by
either inferring a shared node when pathways meet end-to-end (endpoints
are within a distance tolerance) or when endpoint *node\_ids* match.
Specifically, Pathways may define a special *node\_ids* field, an array
of *id* values indicating Points from which the Pathway's geometry is
constructed. The first and last *id* values must each refer to an *id*
of a Point within the dataset. Pathways are further described in the
[List of Entities](#pathways) section.

The Point entity model defines point features. Some point features, such
as curbs and curb ramps, are intended to describe on-network features,
namely nodes in a resulting graph: curbs and curb points should exist at
the endpoint(s) of Pathway(s). Other point features, such as fire
hydrants, should not be on-network features. The only point features
that are currently modeled as network nodes are curb interfaces,
including curb ramps. All other features should be mapped outside of the
network. Points are further described in the [List of
Entities](#points) section.

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

#### Pathway entities only connect end-to-end

A graph structure may be inferred from Pathways via their endpoints and
using an optional *node\_ids* hint. Graph structures shall not be stored
implicitly in other cases, such as when a pathway endpoint is very close
to the middle of another Pathway. If a network-connected relationship
should be represented in such a case, the second Pathway should be split
so that the endpoints are co-located/share a start/end *node\_ids* *id.*
The same logic applies to crossing paths: they do not imply a connection
(a shared graph node) per the OpenSidewalks schema.

#### A road entity and a Crossing that intersects with it should share a location/node

In addition to the above rule about entities connecting end-to-end, it
is considered incorrect for a street crossing to intersect with (cross)
associated road entities. Instead, both the road and crossing entities
should be split such that endpoints are shared.

#### Crossings do not connect to sidewalk centerlines

The OpenSidewalks Schema defines [Crossings](#pathway-crossing) as
existing only on the street surface and
[Sidewalks](#pathway-sidewalk) as describing only
the sidewalk centerline. There must therefore always be space between a
Sidewalk and a Crossing. A Sidewalk and Crossing should be connected by
a plain [Footway](#pathway-footway).

#### Curb interfaces and curb ramps are mapped at Pathway endpoints

Curb interface Points should be mapped directly at the endpoint(s) of
one or more Pathway(s): they are features encountered along a pathway and
should be considered important information when simulating a pedestrian
moving from one Pathway to another. A curb or curb ramp Point

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

## <a name="pathways"></a> Pathways

Pathways are lines (their serializable geometries are representable by
LineStrings) intended to represent pedestrian network connections: when
pathways meet end-to-end, they can be considered network edges connected
by a shared node and used for network analysis and shortest-path
routing. Pathways are often derived from topological data like that
stored in OpenStreetMap, where network information has already been
captured. When this is the case, a pathway may optionally have a
*node\_ids* field, which is an array of string identifiers of nodes to
aid in network inference. Similarly, Point entities may optionally have
a *\_id* field to aid in placing them in a pedestrian network.

All Pathways may use the
[layer](#field-layer) and
[brunnel](#field-brunnel) tags, as all
pedestrian paths may overlap one another at different z-levels or be
part of a bridge or tunnel.

### <a name="pathway-footway"></a> Footway (plain)

#### Description

The centerline of a dedicated pedestrian pathway that does not fall into
any other subcategories.

#### Subtype of

*None*

#### Geometry

LineString

#### Identifying fields

`highway=footway`

*(and no `footway=\*` subtag)*

#### <a name="pathway-footway-optional-fields"></a> Optional Fields

[width](#field-width)

[surface](#field-surface)

[incline](#field-incline)

[length](#field-length)

[layer](#field-layer)

[brunnel](#field-brunnel)

[description](#field-description)

[name](#field-name)

### <a name="pathway-sidewalk"></a> Sidewalk

#### Description

The centerline of a sidewalk, a designated pedestrian pathway to the
side of a street.

#### Subtype of

[Footway](#pathway-footway)

#### Geometry

LineString

#### Description

A dedicated pedestrian pathway (footway) along one side of the road.

#### Identifying fields

`highway=footway, footway=sidewalk`

#### Optional Fields

All [optional fields of footway](#pathway-footway-optional-fields)

[description](#field-description):
Sidewalk-specific usage note: OpenSidewalks data will often infer a
'description' property that states where the sidewalk is in relation to
its associated street. Example: "NW side of 5th Ave".

### <a name="pathway-crossing"></a> Crossing

#### Description

The centerline of a pedestrian street crossing. This pathway exists only on
the road surface itself, i.e. "from curb to curb". Crossings should not
be connected directly to sidewalk centerlines - instead, a short
footway (this schema calls them "links") should connect the two
together.

#### Subtype of

[Footway](#pathway-footway)

#### Geometry

LineString

#### Identifying fields

`highway=footway, footway=crossing`

#### Optional Fields

All [optional fields of footway](#pathway-footway-optional-fields)

[crossing](#field-crossing)

### <a name="pathway-traffic_island"></a> Traffic Island

#### Description

The centerline of a footway traversing a traffic island. Some complex,
long, or busy pedestrian crossings have a built-up "island" to protect
pedestrians, splitting up the crossing of the street into two or more
crossings. As a pedestrian uses this crossing, they will transition
across these pathway elements: sidewalk → footway → crossing → traffic
island → crossing → footway → sidewalk.

#### Subtype of

[Footway](#pathway-footway)

#### Geometry

LineString

#### Identifying fields

`highway=footway, footway=traffic\_island`

#### Optional Fields

All [optional fields of footway](#pathway-footway-optional-fields)

### <a name="pathway-cycleway"></a> Cycleway

#### Description

The centerline of a designated cycling pathway. This pathway may or may
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

### <a name="pathway-primary_street"></name> Primary Street

#### Description

The centerline of a major highway.

#### Subtype of

*None*

#### Geometry

LineString

#### Identifying fields

`highway=primary`

#### <a name="pathway-primary_street-optional-fields"></a> Optional Fields

[width](#field-width)

[surface](#field-surface)

[incline](#field-incline)

[length](#field-length)

[layer](#field-layer)

[brunnel](#field-brunnel)

[description](#field-description)

[name](#field-name)

[foot](#field-foot)

### <a name="pathway-secondary_street"></a> Secondary Street

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
street](#pathway-primary_street-optional-fields).

### <a name="pathway-tertiary_street"></a> Tertiary Street

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
street](#pathway-primary_street-optional-fields).

### <a name="pathway-residential_street"></a> Residential Street

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
street](#pathway-primary_street-optional-fields).

### <a name="pathway-service_road"></a> Service Road

#### Description

A road intended for service use.

#### Subtype of

*None*

#### Geometry

LineString

#### Identifying fields

`highway=service`

#### <a name="pathway-service_road-optional-fields"></a> Optional Fields

[width](#field-width)

[surface](#field-surface)

[incline](#field-incline)

[length](#field-length)

[layer](#field-layer)

[brunnel](#field-brunnel)

[description](#field-description)

[foot](#field-foot)

### <a name="pathway-driveway"></a> Driveway

#### Description

The centerline of a driveway. Typically connects a residence or business
to another road.

#### Subtype of

[Service road](#pathway-service_road)

#### Geometry

LineString

#### Identifying fields

`highway=service, service=driveway`

#### Optional Fields

All of [the optional fields of a service
road](#pathway-service_road-optional-fields).

### <a name="pathway-alley"></a> Alley

#### Description

The centerline of an alley. An alley is usually located between
properties and provides access to utilities and private entrances.

#### Subtype of

[Service road](#pathway-service_road)

#### Geometry

LineString

#### Identifying fields

`highway=service, service=alley`

#### Optional Fields

All of [the optional fields of a service
road](#pathway-service_road-optional-fields).

### <a name="pathway-parking_aisle"></a> Parking aisle

#### Description

The centerline of a subordinated way in a parking lot: vehicles drive on
parking aisles to reach parking spaces in a parking lot.

#### Subtype of

[Service road](#pathway-service_road)

#### Geometry

LineString

#### Identifying fields

`highway=service, service=parking\_aisle`

#### Optional Fields

All of [the optional fields of a service
road](#pathway-service_road-optional-fields).

## <a name="points"></a> Points

Points are features that are geometrically defined by a single
latitude-longitude pair: a point on the planet. They may be defined as a
part of a pedestrian network (curbs and curb ramps) or as nearby
disconnected features (fire hydrants, poles). Each Point may optionally
define a *\_id* string field, a unique identifier for the point feature
to which Pathways may refer using their (also optional) *node\_ids*
field.

### <a name="point-raised_curb"></a> Raised curb

#### Description

A single, designed vertical displacement that separates two pathways. A
common example is the curb that separates a street crossing from a
sidewalk. This is mapped at the point where the two paths meet - on top
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

### <a name="point-rolled_curb"></a> Rolled curb

#### Description

A curb interface with a quarter-circle profile: traversing this curb is
like going over half of a bump. Located where two pathways meet,
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

### <a name="point-curb_ramp"></name> Curb ramp

#### Description

A curb ramp (curb cut) mapped as a curb interface. Mapped at the
location where the two pathways that it connects meet one another.

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

### <a name="point-flush_curb"></a> Flush curb

#### Description

An indicator that there is no raised curb interface where two paths meet
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

A free form text field for describing a path. May be pre-encoded in
relevant pedestrian paths to assist with routing instructing or
investigation of map features. For example, a description of the
sidewalk in relation to a nearby street may be a useful textual
description, such as "NE of Main St." Can also be considered a flexible
location to embed arbitrary information for specific use cases.

###### *Value type*: text

##### <a name="field-name"></a> name

*From OpenStreetMap*

The (semi-)official name of a pathway. *Not* a description of the path.
For example, this would be the street name for a street pathway or a
specially-designated name for a famous footpath. name="The \[X\] trail",
for example.

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
example, a pathway that is inside a building. The value is in OpenStreetMap
syntax for the opening\_hours tag. See [OpenStreetMap
specification](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification)
on the formatting for this field.

###### *Value type*: opening\_hours

##### <a name="field-elevator"></a> elevator

*Unique to OpenSidewalks*

Whether the pathway uses an elevator for vertical movement, e.g. building
paths.

###### *Value type*: boolean

##### <a name="field-width"></a> width

*From OpenStreetMap*

The width of a pathway in meters.

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

Whether a curb ramp or pathway has a tactile (textured) surface.

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
