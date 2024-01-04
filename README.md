*The OpenSidewalks Schema (Draft: OSW v0.2)*
========================

##### Table of Contents  
* [Introduction](#introduction)  
* [OpenSidewalks Schema Entities](#opensidewalks-schema-entities)
  * [Categories](#1-core-entities)
    * [1) Core Entities](#1-core-entities)
      * [Nodes](#nodes)
      * [Edges](#edges)
      * [Zones](#zones)
    * [2) Extensions](#2-extensions)
  * [Entity attributes](#entity-attributes)
  * [Entity type inference](#entity-type-inference)
  * [Metadata fields](#metadata-fields)
* [Network topologies](#network-topologies)
* [Serialization Formats](#serialization-formats)
* [Coordinate Reference System](#coordinate-reference-system)
* [OpenSidewalks Dataset Metadata](#opensidewalks-dataset-metadata)
* [List of Core Entities](#list-of-core-entities)
  * [Nodes](#-nodes)
    * [Bare Node](#-bare-node)
    * [Generic curb](#-generic-curb)
    * [Raised curb](#-raised-curb)
    * [Rolled curb](#-rolled-curb)
    * [Curb ramp](#-curb-ramp)
    * [Flush curb](#-flush-curb)
    * [Unknown curb](#-unknown-curb)
  * [Edges](#-edges)
    * [Footway (plain)](#-footway-plain)
    * [Sidewalk](#-sidewalk)
    * [Crossing](#-crossing)
    * [Traffic Island](#-traffic-island)
    * [Pedestrian](#-pedestrian)
    * [Steps](#-steps)
    * [Roads](#-roads)
  * [Zones](#-zones)
    * [Pedestrian](#-pedestrian-1)
* [List of Extensions](#list-of-extensions)
  * [Points](#-points)
    * [Power pole](#-power-pole)
    * [Fire hydrant](#-fire-hydrant)
    * [Bench](#-bench)
    * [Bollard](#-bollard)
    * [Manhole](#-manhole)
    * [Street Lamp](#-street-lamp)
    * [Waste Basket](#-waste-basket)
  * [Lines](#-lines)
    * [Fence](#-fence)
  * [Polygons](#-polygons)
    * [Building](#-building)
* [Fields](#fields)
  * [description](#--description)
  * [name](#--name)
  * [incline](#--incline)
  * [surface](#--surface)
  * [length](#--length)
  * [width](#--width)
  * [tactile_paving](#--tactile_paving)
  * [crossing](#--crossing)
  * [crossing:markings](#--crossingmarkings)
  * [step_count](#--step_count)
  * [building](#--building)
  * [opening_hours](#--opening_hours)
  * [foot](#--foot)
* [Schema Versions](#schema-versions)

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

The OpenSidewalks Schema defines network and non-network data using a
set of vector geometrical entity types, each of which having an
associated geometry type compatible with either the Point, LineString or Polygon
specification of [Simple Feature Access](https://www.ogc.org/standards/sfa),
fields that uniquely define the entity type (in combination),
optional topological information, and optional key-value pair [metadata
fields](#fields) defined on a per-type
basis.

There are currently two major categories of OpenSidewalks entities:
### 1. Core entities
Core entities are the traversable entities which make up the OpenSidewalks pedestrian
network.

There are three types of core entity models:
* Nodes
* Edges
* Zones

Nodes, Edges and Zones are geometrical features (OGC Points, LineStrings and Polygons,
respectively) with network primitives defined such that a network (or graph)
can be constructed purely from their metadata. Examples of each entity model:

- Node: a raise curb.
- Edge: a sidewalk.
- Zones: a square or plaza.

#### Nodes

[Nodes](#nodes) are point features that also contain metadata to identify them
as network (graph) vertices. Currently, this means that they must have a unique
(within the dataset) `_id` field. Therefore, the set of network vertices in
the dataset could be summarized as a set of these `_id` field values,
consistent with the definition vertices within a graph in graph theory. As
a result of storing these vertex identifiers, Nodes may be placed within a
traversable graph using only metadata, not spatial inference.

#### Edges

[Edges](#edges) are linear features that also contain metadata to identify
them as network (graph) edges. Currently, this means that they must have two
node-referencing fields: `_u_id` and `_v_id`, which mean "this linear feature
begins at the Node with `_id` of `_u_id` and ends at the Node with `_id` of
`_v_id`. Therefore, a network (graph) may be constructed from a set of Nodes
and Edges directly from metadata. Outside of the graph representation, edges 
must have a unique (within the dataset) _id field.

Note that Edges are directional features: the start at one node and end at one
node. The data they represent is directional as well: their geospatial data
must start at one location and end at another and Edges often have fields like
`incline` that only have meaning when direction is understood: a positive
incline value is uphill while a negative incline value is downhill. However,
this does not mean that datasets must be curated with both "forward" (`u` to
`v`) Edges and "reverse" (`v` to `u`) Edges: any "reverse" edge can be
inferred during graph creation.

#### Zones
[Zones](#zones) are polygon features that also contain metadata to identify
them as network (graph) edges. Currently, this means that they must have a list
of node references: `_w_id`, which mean "this 2-dimensional polygon feature consists
of a complete graph with every pair of distinct nodes in `_w_id` connected by a unique edge.
Note that this would yield k(k-1)/2 edges for a zone comprised of k nodes.

### 2. Extensions
Extensions are pedestrian network-adjacent entities which help describe the surrounding
environment of the pedestrian network and can be used to amend the traversable network
with important information. For example, a blind user would benefit from knowing the
footway he is using is adjacent to vegetation on his right side and a lake on his left
side, or a park visitor would want to know where benches are located along his walk.
Extensions are not required for producing a valid OpenSidewalks dataset.

There are three types of extension entity models:
* Points
* Lines
* Polygons

Points, Lines and Polygons are solely geometrical OGC features and they lack
network metadata: their relationship to other members of the dataset are spatial.
Extensions are features relevant to the pedestrian network that are nevertheless not 
represented as elements of it: they are nearby and useful for producing 
descriptions, flagging potential barriers, etc.

Examples of each extension entity model:
- Point: a fire hydrant.
- Line: a wall or a fence.
- Polygon: a planter.

OpenSidewalks schema includes some extensions (i.e. internal extensions) which
we found valuable to the pedestrian experience and are readily available
through community contributions on OpenStreetMap. Other extensions (i.e. external
extensions) can similarly be included in an OpenSidewalks dataset and subsequently spatially
merged with the core entities (i.e. the pedestrian network entities).

### Entity attributes

Every entity has a set of defining attributes:
- *geometry type* that define the OGC geospatial type of the feature.
- *identifying fields* that must be matched to infer the entity type.
- *optional fields* that describe additional attributes of the entity.
- *additional fields* that describe attributes of the entity which have not been captured
by the OpenSidewalks schema. Any *additional fields* must be prefixed with `ext`.

### Entity type inference

Intended to closely mirror OpenStreetMap entities, OpenSidewalks Schema entities
are identified by their set of fields. Fields that uniquely identify an entity
type are called *identifying fields*. In most cases, if an entity has all of
the *identifying fields* specified, its type is matched. The only exception is
for entities whose *identifying fields* are also a subset of other entities'
*identifying fields*, in which case they are identified by (1) having all of
the *identifying fields* listed but also (2) *not* any of the *identifying fields*
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

## Network topologies

The OpenSidewalks Schema includes network topological rules for the ways
in which network-mappable entities can be connected.

### Edge entities only connect end-to-end

While a graph structure may be inferred from Edges via their endpoints, the use
of `_u_id` and `_v_id` are preferred. However, Edge entities should still meet
end-to-end (within some small margin of error), as they are intended to
represent a physically-connected space.

Similarly, no connection is implied when the linear geometries of Edges cross.

### A road entity and a Crossing that intersects with it should share a location/node

In addition to the above rule about entities connecting end-to-end, it
is considered incorrect for a street crossing to intersect with (cross)
associated road entities. Instead, both the road and crossing entities
should be split such that endpoints are shared.

### Crossings do not connect to sidewalk centerlines

The OpenSidewalks Schema defines [Crossings](#edge-crossing) as
existing only on the street surface and
[Sidewalks](#-sidewalk) as describing only
the sidewalk centerline. There must therefore always be space between a
Sidewalk and a Crossing. A Sidewalk and Crossing should be connected by
a plain [Footway](#edge-footway).

### Curb interfaces and curb ramps are mapped at Edge endpoints

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

## Coordinate Reference System

OpenSidewalks uses the the World Geodetic System 1984 (WGS-84) coordinate system. WGS-84 is a geographic coordinate reference system with longitude and latitude units of decimal degrees.
In compliance with the RFC 7946 GeoJSON, a crs member will not be included in the OpenSidewalks datasets.

## OpenSidewalks Dataset Metadata

Each file in the OpenSidewalks dataset will contain the following metadata fields:
- `$schema` (string, required): this field specifies the [schema version](#schema-versions) which the dataset is compliant with and should be used for validation.
- `dataSource` (string, optional): the data source which was used to generate the dataset. This can be OpenStreetMap or satellite imagery or a dataset provided by an agency or a combination of sources.
- `region` (MultiPolygon, optional): a MultiPolygon capturing the geographical covered by the OpenSidewalks dataset.
- `dataTimestamp` (date/time, optional): a date/time field stating the freshness of the data used in creating the OpenSidewalks dataset. For example, if satellite imagery was the basis for generating a dataset then the timestamp associated with these images can be used.
- `pipelineVersion` (string, optional): the software and version of the software that was used to generated the dataset.

The following is a sample snippet demonstrating the use of these metadata fields:
```json
{
   "$schema": "https://sidewalks.uw.edu/opensidewalks/0.2/schema.json",
   "dataSource": "OpenStreetMap",
   "region": {
       "type": "MultiPolygon",
       "coordinates": [
           [
               [
                   [-122.1369414, 47.6365011],
                   [-122.1431969, 47.6365115],
                   [-122.1431951, 47.6469514],
                   [-122.1430782, 47.6495122],
                   [-122.1429792, 47.6495373]
               ]
           ]
       ]
   },
   "dataTimestamp": "2023-08-08T20:22:00Z",
   "pipelineVersion": "OSWDataPipeline-0.1-beta"
}
```

# <a name="list-of-core-entities"></a> List of Core Entities

## <a name="nodes"></a> Nodes

Nodes are features that are geometrically defined by a single
latitude-longitude pair: a point on the planet. They are also defined as a
part of a pedestrian network: each Node must define an `_id` string field, a
unique identifier to which Edges may refer using their `_u_id` and `_v_id`
fields.

<details>
  <summary><h3><a name="node-bare_node"></a> Bare Node</h3></summary>

|   |
|:- |
| **Description**
| A special case of an abstract Node: this is a network (graph) node description that does not have any special metadata beyond location and the `_id` field. A "bare node" exists when two Edges meet at a location that is not one of the other Node types. For example, a single sidewalk may be represented by two [Sidewalk](#-sidewalk) Edges with different `width` values, split where the width changes. There is no physical feature within the OpenSidewalks Schema at that split point: it is just a "bare node" that connects the two Edges together.<br><br>Another way to interpret a "bare node" is in terms of the Edge definition rules: the Nodes referenced by `_u_id` and `_v_id` must exist within the dataset, so we must define Nodes wherever Edges meet regardless of whether that point in space has additional metadata.
| **Subtype of**
| *None*
| **Geometry**
| Point
| **Identifying fields**
| (must have the `_id` field, like all Nodes)
| **Optional Fields**
| *None*

</details>

<details>
  <summary><h3><a name="node-generic_curb"></a> Generic curb</h3></summary>

|   |
|:- |
| **Description**
| A curb for which a type has not been determined yet.
| **Subtype of**
| *None*
| **Geometry**
| Point
| **Identifying fields**
| `barrier=kerb`
| **Optional Fields**
| [tactile_paving](#field-tactile_paving)

</details>

<details>
  <summary><h3><a name="node-raised_curb"></a> Raised curb</h3></summary>

|   |
|:- |
| **Description**
| A single, designed vertical displacement that separates two Edges. A common example is the curb that separates a street crossing from a sidewalk. This is mapped at the Node where the two Edges meet - on top of the curb is physically located.
| **Subtype of**
| [Generic curb](#-generic-curb)
| **Geometry**
| Point
| **Identifying fields**
| `barrier=kerb, kerb=raised`
| **Optional Fields**
| All [optional fields of generic curb](#-generic-curb)

</details>

<details>
  <summary><h3><a name="node-rolled_curb"></a> Rolled curb</h3></summary>

|   |
|:- |
| **Description**
| A curb interface with a quarter-circle profile: traversing this curb is like going over half of a bump. Located where two Edges meet, physically at the location of the curb itself.
| **Subtype of**
| [Generic curb](#-generic-curb)
| **Geometry**
| Point
| **Identifying fields**
| `barrier=kerb, kerb=rolled`
| **Optional Fields**
| All [optional fields of generic curb](#-generic-curb)

</details>

<details>
  <summary><h3><a name="node-curb_ramp"></name> Curb ramp</h3></summary>

|   |
|:- |
| **Description**
| A curb ramp (curb cut) mapped as a curb interface. Mapped at the location where the two Edges that it connects meet one another.
| **Subtype of**
| [Generic curb](#-generic-curb)
| **Geometry**
| Point
| **Identifying fields**
| `barrier=kerb, kerb=lowered`
| **Optional Fields**
| All [optional fields of generic curb](#-generic-curb)

</details>

<details>
  <summary><h3><a name="node-flush_curb"></a> Flush curb</h3></summary>

|   |
|:- |
| **Description**
| An indicator that there is no raised curb interface where two Edges meet - i.e. where someone might expect a curb interface, such as where a crossing and footway meet.
| **Subtype of**
| [Generic curb](#-generic-curb)
| **Geometry**
| Point
| **Identifying fields**
| `barrier=kerb, kerb=flush`
| **Optional Fields**
| All [optional fields of generic curb](#-generic-curb)

</details>

<details>
  <summary><h3><a name="node-unknown_curb"></a> Unknown curb</h3></summary>

|   |
|:- |
| **Description**
| A curb for which a type could not be determined despite some effort.
| **Subtype of**
| [Generic curb](#-generic-curb)
| **Geometry**
| Point
| **Identifying fields**
| `barrier=kerb, kerb=yes`
| **Optional Fields**
| All [optional fields of generic curb](#-generic-curb)

</details>

## <a name="edges"></a> Edges

Edges are lines (their serializable geometries are representable by
LineStrings) intended to represent pedestrian network connections. Edges are
often derived from topological data like that stored in OpenStreetMap. All 
edges must have a unique _id field.

<details>
  <summary><h3><a name="edge-footway"></a> Footway (plain)</h3></summary>

|   |
|:- |
| **Description**
| The centerline of a dedicated pedestrian path that does not fall into any other subcategories.
| **Subtype of**
| *None*
| **Geometry**
| LineString
| **Identifying fields**
| `highway=footway`<br>*(and no `footway=*` subtag)*
| **Optional Fields**
| [width](#field-width)<br>[surface](#field-surface)<br>[incline](#field-incline)<br>[length](#field-length)<br>[description](#field-description)<br>[name](#field-name)<br>[foot](#--foot)

</details>

<details>
  <summary><h3><a name="edge-sidewalk"></a> Sidewalk</h3></summary>

|   |
|:- |
| **Description**
| The centerline of a sidewalk, a designated pedestrian path to the side of a street.
| **Subtype of**
| [Footway](#edge-footway)
| **Geometry**
| LineString
| **Identifying fields**
| `highway=footway, footway=sidewalk`
| **Optional Fields**
| All [optional fields of footway](#-footway-plain)<br>[description](#field-description): Sidewalk-specific usage note: OpenSidewalks data will often infer a 'description' property that states where the sidewalk is in relation to its associated street. Example: "NW side of 5th Ave".

</details>

<details>
  <summary><h3><a name="edge-crossing"></a> Crossing</h3></summary>

|   |
|:- |
| **Description**
| (Part of) the centerline of a pedestrian street crossing. A crossing exists only on the road surface itself, i.e. "from curb to curb".<br><br>Because crossings should be connected to the street network, they should be represented by at least two Edges: one from the first curb interface to the street centerline and one from the street centerline to the second curb interface, e.g..<br><br>Crossings should not be connected directly to sidewalk centerlines, as the sidewalk centerline is never the curb interface. Instead, a short footway should connect the two together.
| **Subtype of**
| [Footway](#edge-footway)
| **Geometry**
| LineString
| **Identifying fields**
| `highway=footway, footway=crossing`
| **Optional Fields**
| All [optional fields of footway](#-footway-plain)<br>[crossing](#field-crossing)<br>[crossing:markings](#field-crossing_markings)

</details>

<details>
  <summary><h3><a name="edge-traffic_island"></a> Traffic Island</h3></summary>

|   |
|:- |
| **Description**
| The centerline of a footway traversing a traffic island. Some complex, long, or busy pedestrian crossings have a built-up "island" to protect pedestrians, splitting up the crossing of the street into two or more crossings. As a pedestrian uses this crossing, they will transition across these Edge elements: sidewalk → footway → crossing → traffic island → crossing → footway → sidewalk.
| **Subtype of**
| [Footway](#edge-footway)
| **Geometry**
| LineString
| **Identifying fields**
| `highway=footway, footway=traffic_island`
| **Optional Fields**
| All [optional fields of footway](#-footway-plain)

</details>

<details>
  <summary><h3><a name="edge-pedestrian"></a> Pedestrian</h3></summary>

|   |
|:- |
| **Description**
| The centerline of a road or an area mainly or exclusively for pedestrians in which some vehicle traffic may be authorized.
| **Subtype of**
| *None*
| **Geometry**
| LineString
| **Identifying fields**
| `highway=pedestrian`
| **Optional Fields**
| [width](#field-width)<br>[surface](#field-surface)<br>[incline](#field-incline)<br>[length](#field-length)<br>[description](#field-description)<br>[name](#field-name)<br>[foot](#--foot)

</details>

<details>
  <summary><h3><a name="edge-steps"></a> Steps</h3></summary>

|   |
|:- |
| **Description**
| The centerline of a flights of steps on footways and paths.
| **Subtype of**
| *None*
| **Geometry**
| LineString
| **Identifying fields**
| `highway=steps`
| **Optional Fields**
| [width](#field-width)<br>[surface](#field-surface)<br>[incline](#field-incline)<br>[length](#field-length)<br>[description](#field-description)<br>[name](#field-name)<br>[step_count](#field-step_count)<br>[foot](#--foot)

</details>

<details>
  <summary><h3><a name="edge-roads"></a> Roads</h3></summary>

While OpenSidewalks schema is centered around the pedestrian experience and accessibility within the pedestrian network, the inclusion of roads as core entities in the schema is justified because:
1) In some areas due to the lack of sidewalks, a pedestrian has to use a road to reach her destination.
2) Sidewalks and crossings are typically referenced by pedestrians in relation to roads, i.e. "Use the Sidewalk East of Main St.", "Turn left and cross Broadway".
3) A pedestrian's safety and environemnt is greatly impacted by her adjacency to a particular road. For example, a wheelchair user may choose to avoid crossing busy roads for her safety unless she has to.

In order to simplify the job of OpenSidewalks consuming applications when attempting to route pedestrians, we have included a [foot](#--foot) field in all edges and zones to indicate whether an entity is safe to traverse by a
pedestrian. We recommend applications clearly communicate the risk to pedestrians if they route users on entities with missing [foot](#--foot) field or with `foot=no`. 

<details>
  <summary><h3><a name="edge-primary-street"></a> Primary Street</h3></summary>

|   |
|:- |
| **Description**
| The centerline of a major highway.
| **Subtype of**
| *None*
| **Geometry**
| LineString
| **Identifying fields**
| `highway=primary`
| **Optional Fields**
| [width](#field-width)<br>[surface](#field-surface)<br>[incline](#field-incline)<br>[length](#field-length)<br>[description](#field-description)<br>[name](#field-name)<br>[foot](#--foot)

</details>

<details>
  <summary><h3><a name="edge-secondary-street"></a> Secondary Street</h3></summary>

|   |
|:- |
| **Description**
| The centerline of a secondary highway: not a major highway, but forms a major link in the national route network.
| **Subtype of**
| *None*
| **Geometry**
| LineString
| **Identifying fields**
| `highway=secondary`
| **Optional Fields**
| All [optional fields of a primary street](#-primary-street).

</details>

<details>
  <summary><h3><a name="edge-tertiary-street"></a> Tertiary Street</h3></summary>

|   |
|:- |
| **Description**
| A road linking small settlements, or the local centers of a large town or city.
| **Subtype of**
| *None*
| **Geometry**
| LineString
| **Identifying fields**
| `highway=tertiary`
| **Optional Fields**
| All [optional fields of a primary street](#-primary-street).

</details>

<details>
  <summary><h3><a name="edge-residential-street"></a> Residential Street</h3></summary>

|   |
|:- |
| **Description**
| A residential street.
| **Subtype of**
| *None*
| **Geometry**
| LineString
| **Identifying fields**
| `highway=residential`
| **Optional Fields**
| All [optional fields of a primary street](#-primary-street).

</details>

<details>
  <summary><h3><a name="edge-service-road"></a> Service Road</h3></summary>

|   |
|:- |
| **Description**
| A road intended for service use.
| **Subtype of**
| *None*
| **Geometry**
| LineString
| **Identifying fields**
| `highway=service`
| **Optional Fields**
| All [optional fields of a primary street](#-primary-street).

</details>

<details>
  <summary><h3><a name="edge-driveway"></a> Driveway</h3></summary>

|   |
|:- |
| **Description**
| The centerline of a driveway. Typically connects a residence or business to another road.
| **Subtype of**
| [Service road](#-service-road)
| **Geometry**
| LineString
| **Identifying fields**
| `highway=service, service=driveway`
| **Optional Fields**
| All [optional fields of a primary street](#-primary-street).

</details>

<details>
  <summary><h3><a name="edge-alley"></a> Alley</h3></summary>

|   |
|:- |
| **Description**
| The centerline of an alley. An alley is usually located between properties and provides access to utilities and private entrances.
| **Subtype of**
| [Service road](#-service-road)
| **Geometry**
| LineString
| **Identifying fields**
| `highway=service, service=alley`
| **Optional Fields**
| All [optional fields of a primary street](#-primary-street).

</details>

<details>
  <summary><h3><a name="edge-parking-aisle"></a> Parking Aisle</h3></summary>

|   |
|:- |
| **Description**
| The centerline of a subordinated way in a parking lot: vehicles drive on parking aisles to reach parking spaces in a parking lot.
| **Subtype of**
| [Service road](#-service-road)
| **Geometry**
| LineString
| **Identifying fields**
| `highway=service, service=parking_aisle`
| **Optional Fields**
| All [optional fields of a primary street](#-primary-street).

</details>

</details>

## <a name="zones"></a> Zones

Zones are polygons (their serializable geometries are representable by
Polygons) intended to represent areas where pedestrians can travel freely in
all directions. They are part of the pedestrian network: each zone contains a list (`_w_id`) of node `_id`'s. All zones must have a unique _id field.

<details>
  <summary><h3><a name="zone-pedestrian"></a> Pedestrian</h3></summary>

|   |
|:- |
| **Description**
| An areas where pedestrians can travel freely in all directions.
| **Subtype of**
| *None*
| **Geometry**
| Polygon
| **Identifying fields**
| `highway=pedestrian, area=yes`
| **Optional Fields**
| [surface](#field-surface)<br>[description](#field-description)<br>[name](#field-name)<br>[foot](#--foot)

</details>

# <a name="list-of-extensions"></a> List of Extensions

## <a name="points"></a> Points

Points are features that are geometrically defined by a single
latitude-longitude pair: a point on the planet. They are explicitly not
elements of the pedestrian network definition (i.e. the graph structure
described by Nodes and Edges), but they are still highly relevant to the
physical pedestrian network. Points may be considered part of the real physical
pedestrian network, but aren't appropriate as elements of the network
described by the OpenSidewalks Schema.


<details>
  <summary><h3><a name="point-power_pole"></a> Power pole</h3></summary>

|   |
|:- |
| **Description**
| A power pole. Often made of wood or metal, they hold power lines.
| **Subtype of**
| *None*
| **Geometry**
| Point
| **Identifying fields**
| `power=pole`
| **Optional Fields**
| *None*

</details>

<details>
  <summary><h3><a name="point-fire_hydrant"></a> Fire hydrant</h3></summary>

|   |
|:- |
| **Description**
| A fire hydrant - where fire response teams connect high-pressure hoses.
| **Subtype of**
| *None*
| **Geometry**
| Point
| **Identifying fields**
| `emergency=fire_hydrant`
| **Optional Fields**
| *None*

</details>

<details>
  <summary><h3><a name="point-bench"></a> Bench</h3></summary>

|   |
|:- |
| **Description**
| A bench - a place for people to sit; allows room for several people.
| **Subtype of**
| *None*
| **Geometry**
| Point
| **Identifying fields**
| `amenity=bench`
| **Optional Fields**
| *None*

</details>

<details>
  <summary><h3><a name="point-bollard"></a> Bollard</h3></summary>

|   |
|:- |
| **Description**
| A Bollard - a solid pillar or pillars made of concrete, metal, plastic, etc., and used to control traffic.
| **Subtype of**
| *None*
| **Geometry**
| Point
| **Identifying fields**
| `barrier=bollard`
| **Optional Fields**
| *None*

</details>

<details>
  <summary><h3><a name="point-manhole"></a> Manhole</h3></summary>

|   |
|:- |
| **Description**
| A manhole - a hole with a cover that allows access to an underground service location, just large enough for a human to climb through.
| **Subtype of**
| *None*
| **Geometry**
| Point
| **Identifying fields**
| `man_made=manhole`
| **Optional Fields**
| *None*

</details>

<details>
  <summary><h3><a name="point-street_lamp"></a> Street Lamp</h3></summary>

|   |
|:- |
| **Description**
| A street lamp - a street light, lamppost, street lamp, light standard, or lamp standard: a raised source of light above a road, which is turned on or lit at night.
| **Subtype of**
| *None*
| **Geometry**
| Point
| **Identifying fields**
| `highway=street_lamp`
| **Optional Fields**
| *None*

</details>

<details>
  <summary><h3><a name="point-waste_basket"></a> Waste Basket</h3></summary>

|   |
|:- |
| **Description**
| A waste basket - a single small container for depositing garbage that is easily accessible for pedestrians.
| **Subtype of**
| *None*
| **Geometry**
| Point
| **Identifying fields**
| `amenity=waste_basket`
| **Optional Fields**
| *None*

</details>

## <a name="lines"></a> Lines

Lines are features that are geometrically defined by a series of coordinates forming a
LineString. They are explicitly not elements of the pedestrian network definition (i.e.
the graph structure described by Nodes, Edges and Zones), but they are still highly relevant
to the physical pedestrian network.

<details>
  <summary><h3><a name="line-fence"></a> Fence</h3></summary>

|   |
|:- |
| **Description**
| A fence is a freestanding structure designed to restrict or prevent movement across a boundary. It is generally distinguished from a wall by the lightness of its construction.
| **Subtype of**
| *None*
| **Geometry**
| LineString
| **Identifying fields**
| `barrier=fence`
| **Optional Fields**
| [length](#field-length)

</details>

## <a name="polygon"></a> Polygons

Polygons describe 2-dimensional areas which are adjacent to pedestrian paths. They are explicitly not elements of the pedestrian network definition (i.e.
the graph structure described by Nodes, Edges and Zones), but they are still highly relevant
to the physical pedestrian network.

<details>
  <summary><h3><a name="polygon-building"></a> Building</h3></summary>

|   |
|:- |
| **Description**
| A building is a man-made structure with a roof, standing more or less permanently in one place.
| **Subtype of**
| *None*
| **Geometry**
| Polygon
| **Identifying fields**
| [building](#field-building)=*
| **Optional Fields**
| [name](#field-name)<br>[opening_hours](#--opening_hours)

</details>

# <a name="fields"></a> Fields

## <a name="fields-overview"></a> Overview

OpenSidewalks Schema fields are typed key-value pairs. Keys are always strings
and values can be any of a specific set. Value types include:

- `boolean`: `true` or `false`

- `text`: unlimited length string

- `enum`: a set of enumerated values designated by strings

- `integer`: an integer

- `numeric`: a number, either integer or decimal

- `opening_hours`: serialized as a string, a specialized format for describing
when a facility or asset is "open", as in accessible to the public.

## List of fields

<details>
  <summary><h5> <a name="field-description"></a> description</h5></summary>

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

</details>
<details>
  <summary><h5> <a name="field-name"></a> name</h5></summary>

*From OpenStreetMap*

The (semi-)official name of an entity. *Not* a
description of the entity. For example, this would be the street name for a
street path or a specially-designated name for a famous footpath.
`name="The [X] trail"`, for example.

###### *Value type*: text

</details>
<details>
  <summary><h5> <a name="field-incline"></a> incline</h5></summary>

*From OpenStreetMap*

The estimated incline over a particular path, i.e. slope, i.e. grade,
i.e. rise over run. If derived from OpenStreetMap data, this is the
maximum incline over the path. If derived from DEM data, it is more
likely to be an underestimation. Positive values indicate an uphill
climb while negative are downhill. For example, a 45 degree downhill
value for incline would be -1.0. For steps, you can use "up" or "down"
to indicate the direction of the climb.

###### *Value type*: numeric or enum

###### *Enumerated values*:

-   up: used when the direction of the steps points upward.

-   down: Used when the direction of the steps points downward.

</details>
<details>
  <summary><h5> <a name="field-surface"></a> surface</h5></summary>

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

-   paving_stones

-   unpaved

-   dirt

-   grass_paver

</details>
<details>
  <summary><h5> <a name="field-length"></a> length</h5></summary>

*From OpenStreetMap*

This is the calculated length of the way, in meters, according to the
Haversine formula (Great-Circle Distance). This calculation is typically
left up to consumers of geometry data, as the geometry is, itself,
furnished for geometrical analysis. This is likely how AccessMap should
also handle these data, but for now length is precalculated.

###### *Value type*: numeric

</details>
<details>
  <summary><h5> <a name="field-width"></a> width</h5></summary>

*From OpenStreetMap*

The width of an Edge in meters.

###### *Value type*: numeric

</details>
<details>
  <summary><h5> <a name="field-tactile_paving"></a> tactile_paving</h5></summary>

*From OpenStreetMap*

Whether a curb ramp or Edge has a tactile (textured) surface.

###### *Value type*: boolean

</details>
<details>
  <summary><h5> <a name="field-crossing"></a> crossing</h5></summary>

*From OpenStreetMap*

Type of street crossing - marked or unmarked. When derived from
OpenStreetMap data, the crossing key undergoes various conversions due
to fragmentation. Both the uncontrolled and zebra values are converted
into marked and the traffic_signals value is ignored.

###### *Value type*: enum

###### *Enumerated values*:

-   marked: a marked crossing.

-   unmarked: an unmarked crossing.

</details>
<details>
  <summary><h5> <a name="field-crossing_markings"></a> crossing:markings</h5></summary>

*From OpenStreetMap*

Whether a pedestrian street crossing has ground markings (and, optionally, what
type of markings exist). When derived from OpenStreetMap data, the
crossing:markings field may be derived not only from the identical
`crossing:markings` tag in OpenStreetMap, but from any unambiguous tags in the
problematic `crossing=*` tag, such as `crossing=marked` -->
`crossing:markings=yes` and `crossing=unmarked` --> `crossing:markings=no`, and
`crossing=zebra` --> `crossing:markings=yes`.

###### *Value type*: enum

###### *Enumerated values*:

-   yes: The crossing has surface markings but the type is unspecified.

-   no: The crossing has no surface markings.

-   surface: There is a surface change but no distinct markings.

-   lines: There are only two parallel lines to indicate the outline of the
crossing.

-   lines:paired: The same as `crossing:markings=lines` but each line is
actually two very-close parallel lines (for a total of 4 lines).

-   dashes: There are only two parallel dashed lines to indicate the outline of
the crossing.

-   dots: There are only two parallel dotted lines (square/round markings with
significant distance between them) to indicate the outline of the crossing.

-   zebra: The crossing is only marked by regularly spaced bars along its
length.

-   zebra:double: The same as `crossing:markings=zebra` but there are two sets
of regularly spaced bars with a small gap between them.

-   zebra:paired: The same as `crossing:markings=zebra` but each bar is made up
of two smaller bars (i.e. there's a small gap between smaller bars).

-   zebra:bicolour: The same as `crossing:markings=zebra` but there are the
bars and gaps are made of two alternating colors.

-   ladder: The same as combining `crossing:markings=zebra` and
`crossing:markings=lines`: horizontal bars but with linear outlines enclosing
the crossing.

-   skewed: The same as `crossing:markings=ladder` but the horizontal bars are
at a slight diagonal (~30 degree shift) - they're skewed.

-   ladder:paired: The same as `crossing:markings=ladder` but the horizontal
bars are actually made up of two very-close smaller bars.

-   rainbow: A crossing with rainbow colors, other than in zebra pattern or lines along the crossing.

-   "lines:rainbow": Rainbow colored lines along the crossing.

-   "zebra:rainbow": A zebra crossing with rainbow colors.

-   ladder:skewed: Two lines orthogonal to the direction of the roadway with diagonal bars connecting the two lines.

-   pictograms: Painted pictogram(s) of pedestrian and/or bicycle (with or without arrows)

</details>
<details>
  <summary><h5> <a name="field-step_count"></a> step_count</h5></summary>

*From OpenStreetMap*

Can be added to indicate the number of steps

###### *Value type*: integer

</details>
<details>
  <summary><h5> <a name="field-building"></a> building</h5></summary>

*From OpenStreetMap*

This field is used to mark a given entity as a building

###### *Value type*: enum

###### *Enumerated values*:

Accommodation
-   apartments: A building arranged into individual dwellings, often on separate floors. May also have retail outlets on the ground floor.
-   barracks: Buildings built to house military personnel or laborers.
-   bungalow: A single-storey detached small house, Dacha.
-   cabin: A cabin is a small, roughly built house usually with a wood exterior and typically found in rural areas.
-   detached: A detached house, a free-standing residential building usually housing a single family.
-   dormitory: A shared building intended for college/university students (not a share room for multiple occupants as implied by the term in British English).
-   farm: A residential building on a farm (farmhouse). For other buildings see below building=farm_auxiliary, building=barn, …
-   ger: A permanent or seasonal round yurt or ger.
-   hotel: A building designed with separate rooms available for overnight accommodation.
-   house: A dwelling unit inhabited by a single household (a family or small group sharing facilities such as a kitchen). Houses forming half of a semi-detached pair, or one of a row of terraced houses, should share at least two nodes with joined neighbours, thereby defining the party wall between the properties.
-   houseboat: A boat used primarily as a home
-   residential: A general tag for a building used primarily for residential purposes. Where additional detail is available consider using 'apartments', 'terrace', 'house', 'detached' or 'semidetached_house'.
-   semidetached_house: A residential house that shares a common wall with another on one side. Typically called a "duplex" in American English.
-   static_caravan: A mobile home (semi)permanently left on a single site
-   stilt_house: A building raised on piles over the surface of the soil or a body of water
-   terrace: A single way used to define the outline of a linear row of residential dwellings, each of which normally has its own entrance, which form a terrace ("row-house" or "townhouse" in North American English). Consider defining each dwelling separately using 'house'.
-   tree_house: An accommodation, often designed as a small hut, sometimes also as a room or small apartment. Built on tree posts or on a natural tree. A tree house has no contact with the ground. Access via ladders, stairs or bridgeways.
-   trullo: A stone hut with a conical roof.

Commercial
-   commercial: A building for non-specific commercial activities, not necessarily an office building. Use 'retail' if the building consists primarily of shops.
-   industrial: A building for industrial purposes. Use warehouse if the purpose is known to be primarily for storage/distribution.
-   kiosk: A small one-room retail building.
-   office: An office building.
-   retail: A building primarily used for selling goods that are sold to the public.
-   supermarket: A building constructed to house a self-service large-area store.
-   warehouse: A building primarily intended for the storage or goods or as part of a distribution system.

Religious
-   cathedral: A building that was built as a cathedral.
-   chapel: A building that was built as a chapel.
-   church: A building that was built as a church.
-   kingdom_hall: A building that was built as a  Kingdom Hall.
-   monastery: A building constructed as [W] monastery. Often, monasteries consist of several distinct buildings with specific functions.
-   mosque: A building errected as mosque.
-   presbytery: A building where priests live and work.
-   religious: Unspecific building related to religion. Prefer more specific values if possible.
-   shrine: A building that was built as a shrine.
-   synagogue: A building that was built as a synagogue.
-   temple: A building that was built as a temple.

Civic/amenity
-   bakehouse: A building that was built as a bakehouse (i.e. for baking bread).
-   bridge: A building used as a bridge (skyway). To map a gatehouse use building=gatehouse. Don't use this tag just for marking bridges (their outlines).
-   civic: A generic tag for a building created to house some civic amenity, for example community centre, library, toilets, sports centre, swimming pool, townhall etc. See building=public and more specific tags like building=library as well.
-   college: A college building.
-   fire_station: A building constructed as fire station, i.e. to house fire fighting equipment and officers, regardless of current use.
-   government: For government buildings in general, including municipal, provincial and divisional secretaries, government agencies and departments, town halls, (regional) parliaments and court houses.
-   gatehouse: An entry control point building, spanning over a highway that enters a city or compound.
-   hospital: A building errected for a hospital.
-   kindergarten: For any generic kindergarten buildings. Buildings for specific uses (sports halls etc.) should be tagged for their purpose.
-   museum: A building which was designed as a museum.
-   public: A building constructed as accessible to the general public (a town hall, police station, court house, etc.).
-   school: A building errected as school. Buildings for specific uses (sports halls etc.) should be tagged for their purpose.
-   toilets: A toilet block.
-   train_station: A building constructed to be a train station building, including buildings that are abandoned and used nowadays for a different purpose.
-   transportation: A building related to public transport. Note that there is a special tag for train station buildings - building=train_station.
-   university: A university building.

Agricultural/plant production
-   barn: An agricultural building that can be used for storage and as a covered workplace.
-   conservatory: A building or room having glass or tarpaulin roofing and walls used as an indoor garden or a sunroom (winter garden).
-   cowshed: A cowshed (cow barn, cow house) is a building for housing cows, usually found on farms.
-   farm_auxiliary: A building on a farm that is not a dwelling (use 'farm' or 'house' for the farm house).
-   greenhouse: A greenhouse is a glass or plastic covered building used to grow plants.
-   slurry_tank: A circular building built to hold a liquid mix of primarily animal excreta (also known as slurry).
-   stable: A building constructed as a stable for horses.
-   sty: A sty (pigsty, pig ark, pig-shed) is a building for raising domestic pigs, usually found on farms.
-   livestock: A building for housing/rising other livestock (apart from cows, horses or pigs covered above), or when the livestock changes.

Sports
-   grandstand: The main stand, usually roofed, commanding the best view for spectators at racecourses or sports grounds.
-   pavilion: A sports pavilion usually with changing rooms, storage areas and possibly an space for functions & events. Avoid using this term for other structures called pavilions by architects (see [W] Pavilion).
-   riding_hall: A building that was built as a riding hall.
-   sports_hall: A building that was built as a sports hall.
-   sports_centre: A building that was built as a sports centre.
-   stadium: A building constructed to be a stadium building, including buildings that are abandoned and used nowadays for a different purpose.

Storage
-   allotment_house: A small outbuilding for short visits in a allotment garden.
-   boathouse: A boathouse is a building used for the storage of boats.
-   hangar: A hangar is a building used for the storage of airplanes, helicopters or space-craft.
-   hut: A hut is a small and crude shelter. Note that this word has two meanings - it may be synonym of building=shed, it may be a residential building of low quality.
-   shed: A shed is a simple, single-storey structure in a back garden or on an allotment that is used for storage, hobbies, or as a workshop.

Cars
-   carport: A carport is a covered structure used to offer limited protection to vehicles, primarily cars, from the elements. Unlike most structures a carport does not have four walls, and usually has one or two.
-   garage: A garage is a building suitable for the storage of one or possibly more motor vehicle or similar. See building=garages for larger shared buildings. For an aircraft garage, see building=hangar.
-   garages: A building that consists of a number of discrete storage spaces for different owners/tenants. See also building=garage.
-   parking: Structure purpose-built for parking cars.

Power/technical buildings
-   digester: A digester is a bioreactor for the production of biogas from biomass.
-   service: Service building usually is a small unmanned building with certain machinery (like pumps or transformers).
-   tech_cab: Small prefabricated cabin structures for the air-conditioned accommodation of different technology.
-   transformer_tower: A transformer tower is a characteristic tall building comprising a distribution transformer and constructed to connect directly to a medium voltage overhead power line. Quite often the power line has since been undergrounded but the building may still serve as a substation.
-   water_tower: A water tower.
-   storage_tank: Storage tanks are containers that hold liquids.
-   silo: A silo is a building for storing bulk materials.

Other buildings
-   beach_hut: A small, usually wooden, and often brightly coloured cabin or shelter above the high tide mark on popular bathing beaches.
-   bunker: A hardened military building.
-   castle: A building constructed as a castle.
-   construction: Used for buildings under construction.
-   container: For a container used as a permanent building. Do not map containers placed temporarily, for example used in shipping or construction.
-   guardhouse: A small building constructed to house guard(s).
-   military: A military building.
-   outbuilding: A less important building near to and on the same piece of land as a larger building.
-   pagoda: A building constructed as a pagoda.
-   quonset_hut: A lightweight prefabricated structure in the shape of a semicircle.
-   roof: A structure that consists of a roof with open sides, such as a rain shelter, and also gas stations.
-   ruins: Frequently used for a house or other building that is abandoned and in poor repair. However, some believe this usage is incorrect, and the tag should only be used for buildings constructed as fake ruins (for example sham ruins in an English landscape garden). See also lifecycle tagging.
-   tent: For a permanently placed tent. Do not map tents placed temporarily.
-   tower: A tower-building.
-   windmill: A building constructed as a traditional windmill, historically used to mill grain with wind power.
-   yes: Use this value where it is not possible to determine a more specific value.

</details>
<details>
  <summary><h5> <a name="field-opening_hours"></a> opening_hours</h5></summary>

*From OpenStreetMap*

The opening hours of the entity. This may apply to, for
example, a path that is inside a building or the building itself. The value is in OpenStreetMap
syntax for the opening_hours tag. See [OpenStreetMap
specification](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification)
on the formatting for this field.

###### *Value type*: opening_hours

</details>
<details>
  <summary><h5> <a name="field-foot"></a> foot</h5></summary>

*From OpenStreetMap*

A field that indicates whether an edge can be used by pedestrians.

###### *Value type*: enum

###### *Enumerated values*:

-   yes: Roads and other objects where the public has a legally-enshrined right for access on foot	

-   no: Access on foot or by pedestrians is prohibited.

-   designated: A preferred or designated route for pedestrians.

-   permissive: Access by pedestrians is permitted but permission may be withdrawn at any time.

-   use_sidepath: Use compulsory parallel footpath instead.

-   private: indicates that walking is not allowed for general public, but the owner may make exceptions at will.

-   destination: Transit traffic forbidden for pedestrians, non-transit to a local destination allowed.

</details>

## Schema Versions
| Version | Release Date | Link | Notes |
| ------ | ------ | ------ | ------ |
| 0.1 | 8/11/2023 | [GitHub](https://github.com/OpenSidewalks/OpenSidewalks-Schema/tree/32dad18bb303289f660fd8d26f02f5e301d0a9d1) | Minimal initial beta release of schema to unblock development of schema consuming applications |
| 0.2 | TBD | [GitHub](https://github.com/OpenSidewalks/OpenSidewalks-Schema/tree/Audiom)| - Add required _id field to edges <br>- Update the documentation with regards to the [coordinate reference system](#coordinate-reference-system) <br>- Introduce the concept of [core entities](#1-core-entities) and [extensions](#2-extensions) <br>- Add [zones](#zones) to [core entities](#1-core-entities) <br>- Add [lines](#lines) and [polygons](#-polygons) to [extensions](#2-extensions) <br>- Add [schema versions](#schema-versions) and [OpenSidewalks dataset metadata](#opensidewalks-dataset-metadata) <br>- Add [pedestrian zone](#-pedestrian-1) to [zones](#zones) <br>- Add [fence](#-fence) to [lines](#lines) <br>- Add [building](#-building) to [polygons](#-polygons) <br>- Add *additional fields* to [entity attributes](#entity-attributes) <br>- Add [roads](#-roads) to [edges](#-edges) with justification <br>- Deprecate climb in favor of [incline](#--incline) to maintain compatibility with OpenStreetMap <br>- Add [opening_hours](#--opening_hours) field and include it in [building](#-building) entity fields <br>- Add [generic curb](#-generic-curb) and [unknown curb](#-unknown-curb) entities to [nodes](#-nodes) <br>- Add [foot](#--foot) field to all [edges](#-edges) and [zones](#-zones)   |        |
