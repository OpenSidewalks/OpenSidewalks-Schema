# _The OpenSidewalks Schema_<!-- omit from toc -->

## Table of Contents<!-- omit from toc -->

<a id="table-of-contents"></a>

- [Introduction](#introduction)
- [OpenSidewalks Schema Entities](#opensidewalks-schema-entities)
  - [Entity Categories](#entity-categories)
    - [1. Core Entities](#1-core-entities)
      - [Nodes](#nodes)
      - [Edges](#edges)
      - [Zones](#zones)
    - [2. Adjacent Entities](#2-adjacent-entities)
      - [Points](#points)
      - [Lines](#lines)
      - [Polygons](#polygons)
  - [Entity Attributes](#entity-attributes)
  - [Entity Type Inference](#entity-type-inference)
  - [Metadata Fields](#metadata-fields)
  - [Network Topologies](#network-topologies)
    - [Edges only connect end-to-end](#edges-only-connect-end-to-end)
    - [A road entity and a crossing that intersects with it should share a Node](#a-road-entity-and-a-crossing-that-intersects-with-it-should-share-a-node)
    - [Crossings do not connect to sidewalk centerlines](#crossings-do-not-connect-to-sidewalk-centerlines)
    - [Curb interfaces and curb ramps are mapped at Edge endpoints](#curb-interfaces-and-curb-ramps-are-mapped-at-edge-endpoints)
  - [Serialization Formats](#serialization-formats)
  - [Coordinate Reference System](#coordinate-reference-system)
  - [OpenSidewalks Dataset Metadata](#opensidewalks-dataset-metadata)
  - [List of Core Entities](#list-of-core-entities)
    - [Nodes](#nodes-1)
    - [Edges](#edges-1)
    - [Zones](#zones-1)
  - [List of Adjacent Entities](#list-of-adjacent-entities)
    - [Points](#points-1)
    - [Lines](#lines-1)
    - [Polygons](#polygons-1)
  - [Fields](#fields)
    - [Fields Overview](#fields-overview)
    - [List of fields](#list-of-fields)
- [Resources](#resources)
- [Schema Versions](#schema-versions)

# Introduction

<a id="introduction"></a>

The OpenSidewalks Schema is an open pedestrian transportation network data standard for describing and sharing pedestrian network and pedestrian network-adjacent data. The OpenSidewalks Schema promotes an explicit network (graph) model wherein its primary data entities can be deterministically transformed into graph Edges and graph Nodes.

Therefore, OpenSidewalks Schema data represents a traversable and graph-analyzable network of (conditional) pedestrian paths like sidewalks, street crossings, some streets, and other paths, as well as metadata representing potential barriers.

The OpenSidewalks Schema is explicitly a _network schema_: its primary features are defined and interpreted as elements of a network (or graph), i.e. Nodes and Edges. Therefore, OpenSidewalks Schema data is understood not only as a set of features describing pedestrian infrastructure, but as _connected elements_ of a pedestrian network.

The OpenSidewalks Schema draws from and is intended to be largely compatible with OpenStreetMap data, though it is possible to create OpenSidewalks Schema data not derived from OpenStreetMap.

# OpenSidewalks Schema Entities

<a id="opensidewalks-schema-entities"></a>

The OpenSidewalks Schema defines network and non-network data using a set of vector geometrical entity types, each of which has an associated geometry type compatible with either the Point, LineString, or Polygon specification of [Simple Feature Access](https://www.ogc.org/standards/sfa), fields that uniquely define the entity type (in combination), optional topological information, and optional key-value pair [metadata fields](#metadata-fields) defined on a per-type basis.

## Entity Categories

<a id="entity-categories"></a>

There are currently two major categories of OpenSidewalks Schema entities: Core Entities and Adjacent Entities.

### 1. Core Entities

<a id="core-entities"></a>

Core Entities are the traversable entities which make up the OpenSidewalks pedestrian network.

There are three types of core entity models:

- Nodes
- Edges
- Zones

Nodes, Edges, and Zones are geometrical features (OGC Points, LineStrings and Polygons, respectively) with network primitives defined such that a network (or graph) can be constructed purely from their metadata. Examples of each entity model:

- Node: a raise curb.
- Edge: a sidewalk.
- Zones: a square or plaza.

#### Nodes

<a id="nodes"></a>

Nodes are Point features (as defined in [Simple Feature Access](https://www.ogc.org/standards/sfa)) that also contain metadata to identify them as network (graph) vertices. They must have a unique (within the dataset) `_id` field. Therefore, the set of network vertices in the dataset could be summarized as a set of these `_id` field values, consistent with the definition of vertices within a graph in graph theory. As a result of storing these vertex identifiers, Nodes may be placed within a traversable graph using only metadata, not spatial inference.

#### Edges

<a id="edges"></a>

Edges are linear features that also contain metadata to identify them as network (graph) Edges. They must have two Node-referencing fields: `_u_id` and `_v_id`, which mean "this linear feature begins at the Node with `_id` of `_u_id` and ends at the Node with `_id` of `_v_id`. Therefore, a network (graph) may be constructed from a set of Nodes and Edges directly from metadata. Outside of the graph representation, Edges must have a unique (within the dataset) `_id` field.

Note that Edges are directional features: they start at one Node and end at one Node. The data they represent is directional as well: their geospatial data must start at one location and end at another and Edges often have fields like `incline` that only have meaning when direction is understood: a positive incline value is uphill while a negative incline value is downhill. However, this does not mean that datasets must be curated with both "forward" (`u` to `v`) Edges and "reverse" (`v` to `u`) Edges: any "reverse" Edge can be inferred during graph creation.

#### Zones

<a id="zones"></a>

Zones are Polygon features that also contain metadata to identify them as network (graph) Edges. They must have a list of Node references: `_w_id`, which mean "this 2-dimensional Polygon feature consists of a complete graph with every pair of distinct Nodes in `_w_id` connected by a unique Edge.

Note that this would yield $k(k-1)/2$ Edges for a Zone comprised of $k$ Nodes.

### 2. Adjacent Entities

<a id="adjacent-entities"></a>

Adjacent Entities are pedestrian network-adjacent entities that help describe the surrounding environment of the pedestrian network and can be used to augment the traversable network with important information. For example, a blind user would benefit from knowing that the footway they are using is adjacent to vegetation on their right side and a lake on their left side, or a park visitor would want to know where benches are located along their walk. Adjacent entities are not required for producing a valid OpenSidewalks dataset.

There are three types of adjacent entity models:

- Points
- Lines
- Polygons

Points, Lines, and Polygons are solely geometrical OGC features and they lack network metadata: their relationship to other members of the dataset is spatial. Adjacent entities are features relevant to the pedestrian network that are nevertheless not represented as elements of it: they are nearby and useful for producing descriptions, flagging potential barriers, etc.

Examples of each adjacent entity model:

- Point: a fire hydrant.
- Line: a wall or a fence.
- Polygon: a planter.

OpenSidewalks schema includes some Adjacent Entities which we found valuable to the pedestrian experience and are readily available through community contributions on OpenStreetMap. Other Custom Entities can also be included in an OpenSidewalks dataset and subsequently spatially merged with the Core Entities defined in the schema.

#### Points

<a id="points"></a>

Points are features that are geometrically defined by a single latitude-longitude pair: a point on the planet. They are explicitly **not** elements of the pedestrian network definition (i.e. the graph structure described by Nodes and Edges), but they are still highly relevant to the physical pedestrian network. Points may be considered part of the real physical pedestrian network, but aren't appropriate as elements of the network described by the OpenSidewalks Schema. All Points must have a unique `_id` field.

#### Lines

<a id="lines"></a>

Lines are features that are geometrically defined by a series of coordinates forming a LineString. They are explicitly **not** elements of the pedestrian network definition (i.e. the graph structure described by Nodes, Edges and Zones), but they are still highly relevant to the physical pedestrian network. All Lines must have a unique `_id` field.

#### Polygons

<a id="polygons"></a>

Polygons describe 2-dimensional areas which are adjacent to pedestrian paths. They are explicitly **not** elements of the pedestrian network definition (i.e. the graph structure described by Nodes, Edges and Zones), but they are still highly relevant to the physical pedestrian network. All Polygons must have a unique `_id` field.

## Entity Attributes

<a id="entity-attributes"></a>

Every entity has a set of defining attributes:

- **_geometry type_** that define the OGC geospatial type of the feature.
- **_identifying fields_** that must be matched to infer the entity type.
- **_optional fields_** that describe additional attributes of the entity.
- **_additional fields_** that describe attributes of the entity which have not been captured by the OpenSidewalks schema. Any _additional fields_ must be prefixed with `ext:`.

## Entity Type Inference

<a id="entity-type-inference"></a>

Intended to closely mirror OpenStreetMap entities, OpenSidewalks Schema entities are identified by their set of attributes. Fields that uniquely identify an entity type are called _identifying fields_. In most cases, if an entity has all of the _identifying fields_ specified and a matching _geometry type_, its type is matched. The only exception is for entities whose _identifying fields_ are also a subset of other entities' _identifying fields_, in which case they are identified by (1) having all of the _identifying fields_ listed and a matching _geometry type_ and also (2) **not** any of the _identifying fields_ of subtypes.

## Metadata Fields

<a id="metadata-fields"></a>

The optional metadata fields that may be populated for OpenSidewalks Schema entities are largely inspired by and compatible with (reading from) OpenStreetMap data.

OpenStreetMap-derived fields represent a standardized and constrained interpretation of OpenStreetMap tags that often represent boolean values as yes/no strings, have unclear enumerated value tags, or allow the use of many different units for distances (e.g., a path's width may be described in meters, centimeters, feet, or other units in OpenStreetMap). The standardization of field types is itself inspired by the OpenMapTiles standard, which is optimized for protobuf-based serialization.

The combination of metadata standardization and network structures make OpenSidewalks data machine-readable and amenable to standardized analysis pipelines.

Additional information on field types can be found in the overview subsection of the fields section.

## Network Topologies

<a id="network-topologies"></a>

The OpenSidewalks Schema includes network topological rules for the ways in which network-mappable entities can be connected.

### Edges only connect end-to-end

<a id="edges-only-connect-end-to-end"></a>

While a graph structure may be inferred from Edges via their endpoints, the use of `_u_id` and `_v_id` are preferred. However, Edge entities should still meet end-to-end as they are intended to represent a physically-connected space.

Similarly, no connection is implied when the linear geometries of Edges cross.

### A road entity and a crossing that intersects with it should share a Node

<a id="a-road-entity-and-a-crossing-that-intersects-with-it-should-share-a-node"></a>

In addition to the above rule about Edge entities connecting end-to-end, it is considered incorrect for a street crossing to intersect with (cross) associated road entities. Instead, both the road and crossing entities should be split such that endpoints are shared.

### Crossings do not connect to sidewalk centerlines

<a id="crossings-do-not-connect-to-sidewalk-centerlines"></a>

The OpenSidewalks Schema defines [Crossings](#crossing) as existing only on the street surface and [Sidewalks](#sidewalk) as describing only the sidewalk centerline. There must therefore always be space between a Sidewalk and a Crossing. A Sidewalk and Crossing should be connected by a plain [Footway](#footway).

### Curb interfaces and curb ramps are mapped at Edge endpoints

<a id="curb-interfaces-and-curb-ramps-are-mapped-at-edge-endpoints"></a>

Curb Nodes should be mapped directly at the endpoint(s) of one or more Edge(s): they are potential barriers or accessible infrastructure encountered along a path, so they should be available for inspection during network traversals. In other words, they are often important decision points when simulating a pedestrian moving through the network.

## Serialization Formats

<a id="serialization-formats"></a>

OpenSidewalks data entities are vector geometries with optional topological data along with metadata that defines the entity type and optional [metadata fields](#metadata-fields) that are mappable to non-nested key-value pairs. As such, OpenSidewalks Schema data can be (de)serialized into a number of tabular and non-tabular GIS and graph formats. There exists both a [reference JSON Schema for a GeoJSON serialization](./opensidewalks.schema.json) codebase for the OpenSidewalks Schema as well as a PostgreSQL schema.

## Coordinate Reference System

<a id="coordinate-reference-system"></a>

OpenSidewalks uses the World Geodetic System 1984 (WGS-84) coordinate system. WGS-84 is a geographic coordinate reference system (CRS) with longitude and latitude units of decimal degrees.

In compliance with the RFC 7946 GeoJSON, OpenSidewalks GeoJSON files will not include a `"crs":` element.

## OpenSidewalks Dataset Metadata

<a id="opensidewalks-dataset-metadata"></a>

Each file in the OpenSidewalks dataset will contain the following metadata fields:

- `$schema` (string, required): this field specifies the [schema version](#schema-versions) which the dataset is compliant with and should be used for validation.
- `dataSource` (object, optional): the data source which was used to generate the dataset. This can be OpenStreetMap, aerial imagery, or a dataset provided by an agency or a combination of sources.
- `region` (MultiPolygon, optional): a MultiPolygon capturing the geographical area covered by the OpenSidewalks dataset.
- `dataTimestamp` (date/time, optional): a date/time field stating the freshness of the data used in creating the OpenSidewalks dataset. For example, if aerial imagery was the basis for generating a dataset then the timestamp associated with these images can be used.
- `pipelineVersion` (object, optional): the software and version of the software that was used to generate the dataset.

The following is a sample snippet demonstrating the use of these metadata fields:

```json
{
  "$schema": "https://sidewalks.washington.edu/opensidewalks/0.2/schema.json",
  "dataSource": {
    "name": "OpenStreetMap",
    "copyright": "https://www.openstreetmap.org/copyright",
    "license": "https://opendatacommons.org/licenses/odbl/1-0/"
  },
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
  "pipelineVersion": {
    "name": "OSWDataPipeline",
    "version": "0.2-beta",
    "url": "https://github.com/TaskarCenterAtUW/OSWDataPipeline/tree/v0.2-beta"
  }
}
```

## List of Core Entities

<a id="list-of-core-entities"></a>

### Nodes

<a id="core-nodes"></a>

Nodes are features that are geometrically defined by a single latitude-longitude pair: a point on the planet. They are also defined as a part of a pedestrian network: each Node must define an `_id` string field, a unique identifier to which Edges and Zones may refer using their `_u_id`, `_v_id` or `_w_id` fields.

<a id="bare-node"></a>

<details><summary><b>Bare Node</b></summary>

|  |  |
| --- | --- |
| **Description** | A special case of an abstract Node: this is a network (graph) Node description that does not have any special metadata beyond location and the `_id` field. A Bare Node exists when two Edges meet at a location that is not one of the other Node types. For example, a single sidewalk may be represented by two [Sidewalk](#sidewalk) Edges with different `width` values, split where the width changes. There is no physical feature within the OpenSidewalks Schema at the location of that split: it is just a Bare Node that connects the two Edges together.<br><br>Another way to interpret a Bare Node is in terms of the Edge definition rules: the Nodes referenced by `_u_id` and `_v_id` must exist within the dataset, so we must define Nodes wherever Edges meet regardless of whether that point in space has additional metadata. |
| **Subtype of** | _None_ |
| **Geometry** | Point |
| **Identifying Fields** | (must have the `_id` field, like all Nodes) |
| **Optional Fields** | _None_ |

</details>

<a id="generic-curb"></a>

<details><summary><b>Generic Curb</b></summary>

|  |  |
| --- | --- |
| **Description** | A curb for which a type has not been determined yet or a type could not be determined despite some effort. |
| **Subtype of** | _None_ |
| **Geometry** | Point |
| **Identifying Fields** | `barrier=kerb` |
| **Optional Fields** | [`tactile_paving`](#tactile-paving) |

</details>

<a id="raised-curb"></a>

<details><summary><b>Raised Curb</b></summary>

|  |  |
| --- | --- |
| **Description** | A single, designed vertical displacement that separates two Edges. A common example is the curb that separates a street crossing from a sidewalk. This is mapped at the Node where the two Edges meet - on top of the curb is physically located. |
| **Subtype of** | [Generic Curb](#generic-curb) |
| **Geometry** | Point |
| **Identifying Fields** | `barrier=kerb`, `kerb=raised` |
| **Optional Fields** | All [optional fields of generic curb](#generic-curb) |

</details>

<a id="rolled-curb"></a>

<details><summary><b>Rolled Curb</b></summary>

|  |  |
| --- | --- |
| **Description** | A curb interface with a quarter-circle profile: traversing this curb is like going over half of a bump. Located where two Edges meet, physically at the location of the curb itself. |
| **Subtype of** | [Generic Curb](#generic-curb) |
| **Geometry** | Point |
| **Identifying Fields** | `barrier=kerb`, `kerb=rolled` |
| **Optional Fields** | All [optional fields of generic curb](#generic-curb) |

</details>

<a id="curb-ramp"></a>

<details><summary><b>Curb Ramp</b></summary>

|  |  |
| --- | --- |
| **Description** | A curb ramp (curb cut) mapped as a curb interface. Mapped at the location where the two Edges that it connects meet one another. |
| **Subtype of** | [Generic Curb](#generic-curb) |
| **Geometry** | Point |
| **Identifying Fields** | `barrier=kerb`, `kerb=lowered` |
| **Optional Fields** | All [optional fields of generic curb](#generic-curb) |

</details>

<a id="flush-curb"></a>

<details><summary><b>Flush Curb</b></summary>

|  |  |
| --- | --- |
| **Description** | An indicator that there is no raised curb interface where two Edges meet - i.e. where someone might expect a curb interface, such as where a crossing and footway meet. |
| **Subtype of** | [Generic Curb](#generic-curb) |
| **Geometry** | Point |
| **Identifying Fields** | `barrier=kerb`, `kerb=flush` |
| **Optional Fields** | All [optional fields of generic curb](#generic-curb) |

</details>

### Edges

<a id="core-edges"></a>

Edges are Lines (their serializable geometries are representable by LineStrings) intended to represent pedestrian network connections. Edges are often derived from topological data like that stored in OpenStreetMap. All Edges must have a unique `_id` field.

<a id="footway"></a>

<details><summary><b>Footway (plain)</b></summary>

|  |  |
| --- | --- |
| **Description** | The centerline of a dedicated pedestrian path that does not fall into any other subcategories. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=footway`<br>_(and no `footway=*` subtag)_ |
| **Optional Fields** | [width](#width)<br>[surface](#surface)<br>[incline](#incline)<br>[length](#length)<br>[description](#description)<br>[name](#name)<br>[foot](#foot) |

</details>

<a id="sidewalk"></a>

<details><summary><b>Sidewalk</b></summary>

|  |  |
| --- | --- |
| **Description** | The centerline of a sidewalk, a designated pedestrian path to the side of a street. |
| **Subtype of** | [Footway](#footway) |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=footway`, `footway=sidewalk` |
| **Optional Fields** | All [optional fields of footway](#footway)<br>[description](#description) |

</details>

<a id="crossing"></a>

<details><summary><b>Crossing</b></summary>

|  |  |
| --- | --- |
| **Description** | (Part of) the centerline of a pedestrian street crossing. A crossing exists only on the road surface itself, i.e. "from curb to curb".<br><br>Because crossings should be connected to the street network, they should be represented by at least two Edges: one from the first curb interface to the street centerline and one from the street centerline to the second curb interface, e.g..<br><br>Crossings should not be connected directly to sidewalk centerlines, as the sidewalk centerline is never the curb interface. Instead, a short footway should connect the two together. |
| **Subtype of** | [Footway](#footway) |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=footway`, `footway=crossing` |
| **Optional Fields** | All [optional fields of footway](#footway)<br>[crossing:markings](#crossing-markings) |

</details>

<a id="traffic-island"></a>

<details><summary><b>Traffic Island</b></summary>

|  |  |
| --- | --- |
| **Description** | The centerline of a footway traversing a traffic island. Some complex, long, or busy pedestrian crossings have a built-up "island" to protect pedestrians, splitting up the crossing of the street into two or more crossings. As a pedestrian uses this crossing, they will transition across these Edge elements: sidewalk → footway → crossing → traffic island → crossing → footway → sidewalk. |
| **Subtype of** | [Footway](#footway) |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=footway`, `footway=traffic_island` |
| **Optional Fields** | All [optional fields of footway](#footway) |

</details>

<a id="pedestrian-road"></a>

<details><summary><b>Pedestrian Road</b></summary>

|  |  |
| --- | --- |
| **Description** | The centerline of a road or an area mainly or exclusively for pedestrians in which some vehicle traffic may be authorized. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=pedestrian` |
| **Optional Fields** | [width](#width)<br>[surface](#surface)<br>[incline](#incline)<br>[length](#length)<br>[description](#description)<br>[name](#name)<br>[foot](#foot) |

</details>

<a id="steps"></a>

<details><summary><b>Steps</b></summary>

|  |  |
| --- | --- |
| **Description** | The centerline of a flight of steps on footways and paths. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=steps` |
| **Optional Fields** | [width](#width)<br>[surface](#surface)<br>[incline](#incline)<br>[length](#length)<br>[description](#description)<br>[name](#name)<br>[step_count](#stepcount)<br>[climb](#climb)<br>[foot](#foot) |

</details>

<a id="living-street"></a>

<details><summary><b>Living Street</b></summary>

|  |  |
| --- | --- |
| **Description** | A street designed with the interests of pedestrians and cyclists in mind by providing enriching and experiential spaces. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=living_street` |
| **Optional Fields** | [width](#width)<br>[surface](#surface)<br>[incline](#incline)<br>[length](#length)<br>[description](#description)<br>[name](#name)<br>[foot](#foot) |

</details>

<a id="motor-vehicle-roads"></a>

<details><summary><b>Motor Vehicle Roads</b></summary>

While OpenSidewalks schema is centered around the pedestrian experience and accessibility within the pedestrian network, the inclusion of roads as core entities in the schema is justified because:

1. In some areas due to the lack of sidewalks, a pedestrian has to use a road to reach their destination.
2. Sidewalks and crossings are typically referenced by pedestrians in relation to roads, i.e. "Use the Sidewalk East of Main St.", "Turn left and cross Broadway".
3. A pedestrian's safety and environment is greatly impacted by their adjacency to a particular road. For example, a wheelchair user may choose to avoid crossing busy roads for their safety unless they have to.

In order to simplify the job of OpenSidewalks consuming applications when attempting to route pedestrians, we have included a [foot](#foot) field in all Edges and Zones to indicate whether an entity is safe to traverse by a pedestrian. We recommend applications clearly communicate the risk to pedestrians if they route users on entities with missing [foot](#foot) field or with `foot=no`.

<a id="primary-street"></a>

<details><summary><b>Primary Street</b></summary>

|  |  |
| --- | --- |
| **Description** | The centerline of a major highway. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=primary` |
| **Optional Fields** | [width](#width)<br>[surface](#surface)<br>[incline](#incline)<br>[length](#length)<br>[description](#description)<br>[name](#name)<br>[foot](#foot) |

</details>

<a id="secondary-street"></a>

<details><summary><b>Secondary Street</b></summary>

|  |  |
| --- | --- |
| **Description** | The centerline of a secondary highway: not a major highway, but forms a major link in the national route network. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=secondary` |
| **Optional Fields** | All [optional fields of a primary street](#primary-street). |

</details>

<a id="tertiary-street"></a>

<details><summary><b>Tertiary Street</b></summary>

|  |  |
| --- | --- |
| **Description** | A road linking small settlements, or the local centers of a large town or city. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=tertiary` |
| **Optional Fields** | All [optional fields of a primary street](#primary-street). |

</details>

<a id="residential-street"></a>

<details><summary><b>Residential Street</b></summary>

|  |  |
| --- | --- |
| **Description** | A residential street. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=residential` |
| **Optional Fields** | All [optional fields of a primary street](#primary-street). |

</details>

<a id="service-road"></a>

<details><summary><b>Service Road</b></summary>

|  |  |
| --- | --- |
| **Description** | A road intended for service use. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=service` |
| **Optional Fields** | All [optional fields of a primary street](#primary-street). |

</details>

<a id="driveway"></a>

<details><summary><b>Driveway</b></summary>

|  |  |
| --- | --- |
| **Description** | The centerline of a driveway. Typically connects a residence or business to another road. |
| **Subtype of** | [Service road](#service-road) |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=service`, `service=driveway` |
| **Optional Fields** | All [optional fields of a primary street](#primary-street). |

</details>

<a id="alley"></a>

<details><summary><b>Alley</b></summary>

|  |  |
| --- | --- |
| **Description** | The centerline of an alley. An alley is usually located between properties and provides access to utilities and private entrances. |
| **Subtype of** | [Service road](#service-road) |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=service`, `service=alley` |
| **Optional Fields** | All [optional fields of a primary street](#primary-street). |

</details>

<a id="parking-aisle"></a>

<details><summary><b>Parking Aisle</b></summary>

|  |  |
| --- | --- |
| **Description** | The centerline of a subordinated way in a parking lot: vehicles drive on parking aisles to reach parking spaces in a parking lot. |
| **Subtype of** | [Service road](#service-road) |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=service`, `service=parking_aisle` |
| **Optional Fields** | All [optional fields of a primary street](#primary-street). |

</details>

<a id="unclassified-road"></a>

<details><summary><b>Unclassified Road</b></summary>

|  |  |
| --- | --- |
| **Description** | A minor public road, typically at the lowest level of whatever administrative hierarchy is used in that jurisdiction. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=unclassified` |
| **Optional Fields** | All [optional fields of a primary street](#primary-street). |

</details>

<a id="trunk-road"></a>

<details><summary><b>Trunk Road</b></summary>

|  |  |
| --- | --- |
| **Description** | A high-performance or high-importance road that doesn't meet the requirements for motorway, but is not classified as highway=primary either. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `highway=trunk` |
| **Optional Fields** | All [optional fields of a primary street](#primary-street). |

</details>

</details>

### Zones

<a id="core-zones"></a>

Zones are features that are geometrically defined by a Polygon (a closed ring of coordinates). They are also defined as a part of a pedestrian network: each Zone must define an `_id` string field, a unique identifier, and a list (`_w_id`) of Node `_id`s that define the Zone's boundary.

<a id="pedestrian-zone"></a>

<details><summary><b>Pedestrian Zone</b></summary>

|  |  |
| --- | --- |
| **Description** | An area where pedestrians can travel freely in all directions. |
| **Subtype of** | _None_ |
| **Geometry** | Polygon |
| **Identifying Fields** | `highway=pedestrian` |
| **Optional Fields** | [surface](#surface)<br>[description](#description)<br>[name](#name)<br>[foot](#foot) |

</details>

## List of Adjacent Entities

<a id="list-of-adjacent-entities"></a>

### Points

<a id="adjacent-points"></a>

Points are features that are geometrically defined by a single latitude-longitude pair: a point on the planet. They are explicitly **not** elements of the pedestrian network definition (i.e. the graph structure described by Nodes and Edges), but they are still highly relevant to the physical pedestrian network. All Points must have a unique `_id` field.

<a id="power-pole"></a>

<details><summary><b>Power Pole</b></summary>

|  |  |
| --- | --- |
| **Description** | A power pole. Often made of wood or metal, they hold power lines. |
| **Subtype of** | _None_ |
| **Geometry** | Point |
| **Identifying Fields** | `power=pole` |
| **Optional Fields** | _None_ |

</details>

<a id="fire-hydrant"></a>

<details><summary><b>Fire Hydrant</b></summary>

|  |  |
| --- | --- |
| **Description** | A fire hydrant - where fire response teams connect high-pressure hoses. |
| **Subtype of** | _None_ |
| **Geometry** | Point |
| **Identifying Fields** | `emergency=fire_hydrant` |
| **Optional Fields** | _None_ |

</details>

<a id="bench"></a>

<details><summary><b>Bench</b></summary>

|  |  |
| --- | --- |
| **Description** | A bench - a place for people to sit; allows room for several people. |
| **Subtype of** | _None_ |
| **Geometry** | Point |
| **Identifying Fields** | `amenity=bench` |
| **Optional Fields** | _None_ |

</details>

<a id="bollard"></a>

<details><summary><b>Bollard</b></summary>

|  |  |
| --- | --- |
| **Description** | A bollard - a solid pillar or pillars made of concrete, metal, plastic, etc., and used to control traffic. |
| **Subtype of** | _None_ |
| **Geometry** | Point |
| **Identifying Fields** | `barrier=bollard` |
| **Optional Fields** | _None_ |

</details>

<a id="manhole"></a>

<details><summary><b>Manhole</b></summary>

|  |  |
| --- | --- |
| **Description** | A manhole - a hole with a cover that allows access to an underground service location, just large enough for a human to climb through. |
| **Subtype of** | _None_ |
| **Geometry** | Point |
| **Identifying Fields** | `man_made=manhole` |
| **Optional Fields** | _None_ |

</details>

<a id="street-lamp"></a>

<details><summary><b>Street Lamp</b></summary>

|  |  |
| --- | --- |
| **Description** | A street lamp - a street light, lamppost, street lamp, light standard, or lamp standard: a raised source of light above a road, which is turned on or lit at night. |
| **Subtype of** | _None_ |
| **Geometry** | Point |
| **Identifying Fields** | `highway=street_lamp` |
| **Optional Fields** | _None_ |

</details>

<a id="waste-basket"></a>

<details><summary><b>Waste Basket</b></summary>

|  |  |
| --- | --- |
| **Description** | A waste basket - a single small container for depositing garbage that is easily accessible for pedestrians. |
| **Subtype of** | _None_ |
| **Geometry** | Point |
| **Identifying Fields** | `amenity=waste_basket` |
| **Optional Fields** | _None_ |

</details>

### Lines

<a id="adjacent-lines"></a>

Lines are features that are geometrically defined by a series of coordinates forming a LineString. They are explicitly **not** elements of the pedestrian network definition (i.e. the graph structure described by Nodes, Edges and Zones), but they are still highly relevant to the physical pedestrian network. All Lines must have a unique `_id` field.

<a id="fence"></a>

<details><summary><b>Fence</b></summary>

|  |  |
| --- | --- |
| **Description** | A fence is a freestanding structure designed to restrict or prevent movement across a boundary. It is generally distinguished from a wall by the lightness of its construction. |
| **Subtype of** | _None_ |
| **Geometry** | LineString |
| **Identifying Fields** | `barrier=fence` |
| **Optional Fields** | [length](#length) |

</details>

### Polygons

<a id="adjacent-polygons"></a>

Polygons describe 2-dimensional areas which are adjacent to pedestrian paths. They are explicitly **not** elements of the pedestrian network definition (i.e. the graph structure described by Nodes, Edges and Zones), but they are still highly relevant to the physical pedestrian network. All Polygons must have a unique `_id` field.

<a id="building"></a>

<details><summary><b>Building</b></summary>

|  |  |
| --- | --- |
| **Description** | A building is a man-made structure with a roof, standing more or less permanently in one place. |
| **Subtype of** | _None_ |
| **Geometry** | Polygon |
| **Identifying Fields** | [building](#building-1)=\* |
| **Optional Fields** | [name](#name)<br>[opening_hours](#opening-hours) |

</details>

## Fields

<a id="fields"></a>

### Fields Overview

<a id="fields-overview"></a>

OpenSidewalks Schema fields are typed key-value pairs. Keys are always strings and values can be any of a specific set. Value types include:

- `boolean`: `true` or `false`
- `text`: unlimited length string
- `enum`: a set of enumerated values designated by strings
- `integer`: an integer
- `numeric`: a number, either integer or decimal
- `opening_hours`: serialized as a string, a specialized format for describing when a facility or asset is "open", as in accessible to the public.

### List of fields

<a id="list-of-fields"></a>

<a id="description"></a>

<details><summary><b>description</b></summary>

|  |  |
| --- | --- |
| **Description** | This may be a field inferred from other data. A free form text field for describing an Edge, which may be pre-encoded in relevant pedestrian Edges to assist with routing, instructing, or investigation of map features; for example, a description of the sidewalk in relation to a nearby street ("NE of Main St.") or other short (1-3 sentences) textual information not directly available in the schema, such as "this path is muddy when wet." Note that because description data are unstructured, they can only be interpreted individually by people and should not be considered a dumping ground for extra data. |
| **Value type** | text |

</details>

<a id="name"></a>

<details><summary><b>name</b></summary>

|  |  |
| --- | --- |
| **Description** | The (semi-)official name of an entity. _Not_ a description of the entity. For example, this would be the street name for a street path or a specially-designated name for a famous footpath. `name="The [X] trail"`, for example. |
| **Value type** | text |

</details>

<a id="incline"></a>

<details><summary><b>incline</b></summary>

|  |  |
| --- | --- |
| **Description** | The estimated incline over a particular path, i.e. slope, i.e. grade, i.e. rise over run. If derived from OpenStreetMap data, this is the maximum incline over the path. If derived from DEM data, it is more likely to be an underestimation. Positive values indicate an uphill climb while negative are downhill. For example, a 45 degree downhill value for incline would be -1.0. For steps, you can use "up" or "down" to indicate the direction of the climb relative to the direction of the Edge. |
| **Value type** | numeric |

</details>

<a id="surface"></a>

<details><summary><b>surface</b></summary>

|  |  |
| --- | --- |
| **Description** | The surface material of the path. Derived directly from the surface tag from OpenStreetMap. |
| **Value type** | enum |
| **Enumerated Values** | - _asphalt_<br>- _concrete_<br>- _gravel_<br>- _grass_<br>- _paved_<br>- _paving_stones_<br>- _unpaved_<br>- _dirt_<br>- _grass_paver_ |

</details>

<a id="length"></a>

<details><summary><b>length</b></summary>

|  |  |
| --- | --- |
| **Description** | This is the calculated length of the way, in meters, according to the Haversine formula (Great-Circle Distance). This calculation is typically left up to consumers of geometry data, as the geometry is, itself, furnished for geometrical analysis. This is likely how AccessMap should also handle these data, but for now length is precalculated. |
| **Value type** | numeric |

</details>

<a id="width"></a>

<details><summary><b>width</b></summary>

|  |  |
| --- | --- |
| **Description** | The width of an Edge in meters. |
| **Value type**  | numeric |

</details>

<a id="tactile-paving"></a>

<details><summary><b>tactile_paving</b></summary>

|  |  |
| --- | --- |
| **Description** | A field for whether a curb has a tactile (textured) surface. Tactile paving is a system of textured ground surface indicators found on footpaths, stairs and public transportation platforms to assist pedestrians who are blind or visually impaired. A tactile paving area has a surface that is easy to detect using a long cane, typically because it is rougher than the surrounding surface area or has an embossed pattern. |
| **Value type** | enum |
| **Enumerated Values** | - _yes_<br>- _no_<br>- _contrasted_: Where there is a tactile paving which contrast is at least 70% the colour of the ground (white if the ground is black and vice-versa).<br>- _primitive_: Where any water drain or decorative tactile element can be used for orientation accidentally, but no typical tactile ground elements are used. |

</details>

<a id="crossing-markings"></a>

<details><summary><b>crossing:markings</b></summary>

|  |  |
| --- | --- |
| **Description** | Whether a pedestrian street crossing has ground markings (and, optionally, what type of markings exist). When derived from OpenStreetMap data, the crossing:markings field may be derived not only from the identical `crossing:markings` tag in OpenStreetMap, but from any unambiguous tags in the problematic `crossing=*` tag, such as `crossing=marked` --> `crossing:markings=yes` and `crossing=unmarked` --> `crossing:markings=no`, and `crossing=zebra` --> `crossing:markings=yes`. |
| **Value type** | enum |
| **Enumerated Values** | - _yes_: The crossing has surface markings but the type is unspecified.<br>- _no_: The crossing has no surface markings.<br>- _surface_: There is a surface change but no distinct markings.<br>- _lines_: There are only two parallel lines to indicate the outline of the crossing.<br>- _lines:paired_: The same as `crossing:markings=lines` but each line is actually two very-close parallel lines (for a total of 4 lines).<br>- _dashes_: There are only two parallel dashed lines to indicate the outline of the crossing.<br>- _dots_: There are only two parallel dotted lines (square/round markings with significant distance between them) to indicate the outline of the crossing.<br>- _zebra_: The crossing is only marked by regularly spaced bars along its length.<br>-zebra:double: The same as `crossing:markings=zebra` but there are two sets of regularly spaced bars with a small gap between them.<br>- _zebra:paired_: The same as `crossing:markings=zebra` but each bar is made up of two smaller bars (i.e. there's a small gap between smaller bars).<br>- _zebra:bicolour_: The same as `crossing:markings=zebra` but there are the bars and gaps are made of two alternating colors.<br>- _ladder_: The same as combining `crossing:markings=zebra` and `crossing:markings=lines`: horizontal bars but with linear outlines enclosing the crossing.<br>- _skewed_: The same as `crossing:markings=ladder` but the horizontal bars are at a slight diagonal (~30 degree shift) - they're skewed.<br>- _ladder:paired_: The same as `crossing:markings=ladder` but the horizontal bars are actually made up of two very-close smaller bars.<br>- _rainbow_: A crossing with rainbow colors, other than in zebra pattern or lines along the crossing.<br>- _lines:rainbow_: Rainbow colored lines along the crossing.<br>- _zebra:rainbow_: A zebra crossing with rainbow colors.<br>- _ladder:skewed_: Two lines orthogonal to the direction of the roadway with diagonal bars connecting the two lines.<br>- _pictograms_: Painted pictogram(s) of pedestrian and/or bicycle (with or without arrows) |

</details>

<a id="step-count"></a>

<details><summary><b>step_count</b></summary>

|  |  |
| --- | --- |
| **Description** | Can be added to indicate the number of steps |
| **Value type**  | integer |

</details>

<a id="climb"></a>

<details><summary><b>climb</b></summary>

|  |  |
| --- | --- |
| **Description** | For steps, can be used to indicate the direction of the climb relative to the direction of the Edge |
| **Value type** | enum |
| **Enumerated Values** | - _up_: when a way rises upward _in the direction_ of the Edge.<br>- _down_: when a way rises upward _against the direction_ of the Edge. |

</details>

<a id="building-1"></a>

<details><summary><b>building</b></summary>

|  |  |
| --- | --- |
| **Description** | This field is used to mark a given entity as a building |
| **Value type** | enum |
| **Enumerated Values** | <details><summary><b>Accommodation</b></summary>- _apartments_: A building arranged into individual dwellings, often on separate floors. May also have retail outlets on the ground floor.<br>- _barracks_: Buildings built to house military personnel or laborers.<br>- _bungalow_: A single-storey detached small house, Dacha.<br>- _cabin_: A cabin is a small, roughly built house usually with a wood exterior and typically found in rural areas.<br>- _detached_: A detached house, a free-standing residential building usually housing a single family.<br>- _dormitory_: A shared building intended for college/university students (not a share room for multiple occupants as implied by the term in British English).<br>- _farm_: A residential building on a farm (farmhouse). For other buildings see below _building=farm_auxiliary_, building=barn, etc.<br>- _ger_: A permanent or seasonal round yurt or ger.<br>- _hotel_: A building designed with separate rooms available for overnight accommodation.<br>- _house_: A dwelling unit inhabited by a single household (a family or small group sharing facilities such as a kitchen). Houses forming half of a semi-detached pair, or one of a row of terraced houses, should share at least two Nodes with joined neighbours, thereby defining the party wall between the properties.<br>- _houseboat_: A boat used primarily as a home<br>- _residential_: A general tag for a building used primarily for residential purposes. Where additional detail is available consider using 'apartments', 'terrace', 'house', 'detached' or 'semidetached_house'.<br>- _semidetached_house_: A residential house that shares a common wall with another on one side. Typically called a "duplex" in American English.<br>- _static_caravan_: A mobile home (semi)permanently left on a single site<br>- _stilt_house_: A building raised on piles over the surface of the soil or a body of water<br>- _terrace_: A single way used to define the outline of a linear row of residential dwellings, each of which normally has its own entrance, which form a terrace ("row-house" or "townhouse" in North American English). Consider defining each dwelling separately using 'house'.<br>- _tree_house_: An accommodation, often designed as a small hut, sometimes also as a room or small apartment. Built on tree posts or on a natural tree. A tree house has no contact with the ground. Access via ladders, stairs or bridgeways.<br>- _trullo_: A stone hut with a conical roof.<br></details><br><details><summary><b>Commercial</b></summary><b>- _commercial_: A building for non-specific commercial activities, not necessarily an office building. Use 'retail' if the building consists primarily of shops.<br>- _industrial_: A building for industrial purposes. Use warehouse if the purpose is known to be primarily for storage/distribution.<br>- _kiosk_: A small one-room retail building.<br>- _office_: An office building.<br>- _retail_: A building primarily used for selling goods that are sold to the public.<br>- _supermarket_: A building constructed to house a self-service large-area store.<br>- _warehouse_: A building primarily intended for the storage or goods or as part of a distribution system.<br></details><br><details><summary><b>Religious</b></summary><b>- _cathedral_: A building that was built as a cathedral.<br>- _chapel_: A building that was built as a chapel.<br>- _church_: A building that was built as a church.<br>- _kingdom_hall_: A building that was built as a Kingdom Hall.<br>- _monastery_: A building constructed as monastery. Often, monasteries consist of several distinct buildings with specific functions.<br>- _mosque_: A building erected as mosque.<br>- _presbytery_: A building where priests live and work.<br>- _religious_: Unspecific building related to religion. Prefer more specific values if possible.<br>- _shrine_: A building that was built as a shrine.<br>- _synagogue_: A building that was built as a synagogue.<br>- _temple_: A building that was built as a temple.<br></details><br><details><summary><b>Civic/amenity</b></summary><b>- _bakehouse_: A building that was built as a bakehouse (i.e. for baking bread).<br>- _bridge_: A building used as a bridge (skyway). To map a gatehouse use building=gatehouse. Don't use this tag just for marking bridges (their outlines).<br>- _civic_: A generic tag for a building created to house some civic amenity, for example community centre, library, toilets, sports centre, swimming pool, townhall etc. See building=public and more specific tags like building=library as well.<br>- _college_: A college building.<br>- _fire_station_: A building constructed as fire station, i.e. to house fire fighting equipment and officers, regardless of current use.<br>- _government_: For government buildings in general, including municipal, provincial and divisional secretaries, government agencies and departments, town halls, (regional) parliaments and court houses.<br>- _gatehouse_: An entry control point building, spanning over a highway that enters a city or compound.<br>- _hospital_: A building erected for a hospital.<br>- _kindergarten_: For any generic kindergarten buildings. Buildings for specific uses (sports halls etc.) should be tagged for their purpose.<br>- _museum_: A building which was designed as a museum.<br>- _public_: A building constructed as accessible to the general public (a town hall, police station, court house, etc.).<br>- _school_: A building erected as school. Buildings for specific uses (sports halls etc.) should be tagged for their purpose.<br>- _toilets_: A toilet block.<br>- _train_station_: A building constructed to be a train station building, including buildings that are abandoned and used nowadays for a different purpose.<br>- _transportation_: A building related to public transport. Note that there is a special tag for train station buildings - _building=train_station_.<br>- _university_: A university building.<br></details><br><details><summary><b>Agricultural/plant production</b></summary><b>- _barn_: An agricultural building that can be used for storage and as a covered workplace.<br>- _conservatory_: A building or room having glass or tarpaulin roofing and walls used as an indoor garden or a sunroom (winter garden).<br>- _cowshed_: A cowshed (cow barn, cow house) is a building for housing cows, usually found on farms.<br>- _farm_auxiliary_: A building on a farm that is not a dwelling (use 'farm' or 'house' for the farm house).<br>- _greenhouse_: A greenhouse is a glass or plastic covered building used to grow plants.<br>- _slurry_tank_: A circular building built to hold a liquid mix of primarily animal excreta (also known as slurry).<br>- _stable_: A building constructed as a stable for horses.<br>- _sty_: A sty (pigsty, pig ark, pig-shed) is a building for raising domestic pigs, usually found on farms.<br>- _livestock_: A building for housing/rising other livestock (apart from cows, horses or pigs covered above), or when the livestock changes.<br></details><br><details><summary><b>Sports</b></summary><b>- _grandstand_: The main stand, usually roofed, commanding the best view for spectators at racecourses or sports grounds.<br>- _pavilion_: A sports pavilion usually with changing rooms, storage areas and possibly an space for functions & events. Avoid using this term for other structures called pavilions by architects.<br>- _riding_hall_: A building that was built as a riding hall.<br>- _sports_hall_: A building that was built as a sports hall.<br>- _sports_centre_: A building that was built as a sports centre.<br>- _stadium_: A building constructed to be a stadium building, including buildings that are abandoned and used nowadays for a different purpose.<br></details><br><details><summary><b>Storage</b></summary><b>- _allotment_house_: A small outbuilding for short visits in a allotment garden.<br>- _boathouse_: A boathouse is a building used for the storage of boats.<br>- _hangar_: A hangar is a building used for the storage of airplanes, helicopters or space-craft.<br>- _hut_: A hut is a small and crude shelter. Note that this word has two meanings - it may be synonym of building=shed, it may be a residential building of low quality.<br>- _shed_: A shed is a simple, single-storey structure in a back garden or on an allotment that is used for storage, hobbies, or as a workshop.<br></details><br><details><summary><b>Cars</b></summary><b>- _carport_: A carport is a covered structure used to offer limited protection to vehicles, primarily cars, from the elements. Unlike most structures a carport does not have four walls, and usually has one or two.<br>- _garage_: A garage is a building suitable for the storage of one or possibly more motor vehicle or similar. See building=garages for larger shared buildings. For an aircraft garage, see building=hangar.<br>- _garages_: A building that consists of a number of discrete storage spaces for different owners/tenants. See also building=garage.<br>- _parking_: Structure purpose-built for parking cars.<br></details><br><details><summary><b>Power/technical buildingsrs</b></summary><b>- _digester_: A digester is a bioreactor for the production of biogas from biomass.<br>- _service_: Service building usually is a small unmanned building with certain machinery (like pumps or transformers).<br>- _tech_cab_: Small prefabricated cabin structures for the air-conditioned accommodation of different technology.<br>- _transformer_tower_: A transformer tower is a characteristic tall building comprising a distribution transformer and constructed to connect directly to a medium voltage overhead power line. Quite often the power line has since been undergrounded but the building may still serve as a substation.<br>- _water_tower_: A water tower.<br>- _storage_tank_: Storage tanks are containers that hold liquids.<br>- _silo_: A silo is a building for storing bulk materials.<br></details><br><details><summary><b>Other buildings</b></summary><b>- _beach_hut_: A small, usually wooden, and often brightly coloured cabin or shelter above the high tide mark on popular bathing beaches.<br>- _bunker_: A hardened military building.<br>- _castle_: A building constructed as a castle.<br>- _construction_: Used for buildings under construction.<br>- _container_: For a container used as a permanent building. Do not map containers placed temporarily, for example used in shipping or construction.<br>- _guardhouse_: A small building constructed to house guard(s).<br>- _military_: A military building.<br>- _outbuilding_: A less important building near to and on the same piece of land as a larger building.<br>- _pagoda_: A building constructed as a pagoda.<br>- _quonset_hut_: A lightweight prefabricated structure in the shape of a semicircle.<br>- _roof_: A structure that consists of a roof with open sides, such as a rain shelter, and also gas stations.<br>- _ruins_: Frequently used for a house or other building that is abandoned and in poor repair. However, some believe this usage is incorrect, and the tag should only be used for buildings constructed as fake ruins (for example sham ruins in an English landscape garden). See also lifecycle tagging.<br>- _tent_: For a permanently placed tent. Do not map tents placed temporarily.<br>- _tower_: A tower-building.<br>- _windmill_: A building constructed as a traditional windmill, historically used to mill grain with wind power.<br>- _yes_: Use this value where it is not possible to determine a more specific value. | <br></details> |

</details>

<a id="opening-hours"></a>

<details><summary><b>opening_hours</b></summary>

|  |  |
| --- | --- |
| **Description** | The opening hours of the entity. This may apply to, for example, a path that is inside a building or the building itself. The value is in OpenStreetMap syntax for the `opening_hours` tag. See [OpenStreetMap specification](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification) on the formatting for this field. |
| **Value type** | opening_hours |

</details>

<a id="foot"></a>

<details><summary><b>foot</b></summary>

|  |  |
| --- | --- |
| **Description** | A field that indicates whether an Edge can be used by pedestrians. |
| **Value type** | enum |
| **Enumerated Values** | - _yes_: Roads and other objects where the public has a legally-enshrined right for access on foot<br>- _no_: Access on foot or by pedestrians is prohibited.<br>- _designated_: A preferred or designated route for pedestrians.<br>- _permissive_: Access by pedestrians is permitted but permission may be withdrawn at any time.<br>- _use_sidepath_: Use compulsory parallel footpath instead.<br>- _private_: indicates that walking is not allowed for general public, but the owner may make exceptions at will.<br>- _destination_: Transit traffic forbidden for pedestrians, non-transit to a local destination allowed. |

</details>

# Resources

<a id="resources"></a>

Mapping guides, as well as resources for use in JOSM including a map style and presets, are made available in the [resources](./resources/) directory.

# Schema Versions

<a id="schema-versions"></a>

| Version | Release Date | Link | Notes |
| --- | --- | --- | --- |
| 0.1 | 2023-08-11 | [GitHub](https://github.com/OpenSidewalks/OpenSidewalks-Schema/tree/32dad18bb303289f660fd8d26f02f5e301d0a9d1) | - Minimal initial beta release of schema to unblock development of schema consuming applications |
| 0.2 | 2024-01-30 | [GitHub](https://github.com/OpenSidewalks/OpenSidewalks-Schema) | - Add required `_id` Field to [Edges](#edges)<br>- Update the documentation with regards to the [coordinate reference system](#coordinate-reference-system)<br>- Introduce the concept of [Core Entities](#core-entities) and [Adjacent Entities](#adjacent-entities) (formerly called "Extensions")<br>- Add [Zones](#zones) to [Core Entities](#core-entities)<br>- Add [Lines](#lines) and [Polygons](#polygons) to [Adjacent Entities](#adjacent-entities)<br>- Add [Schema Versions](#schema-versions) and [OpenSidewalks Dataset Metadata](#opensidewalks-dataset-metadata)<br>- Add [Pedestrian Zone](#pedestrian-zone) to [Zones](#zones)<br>- Add [Fence](#fence) to [Lines](#lines)<br>- Add [Building](#building) to [Polygons](#polygons)<br>- Add _additional fields_ to [Entity Attributes](#entity-attributes)<br>- Add [Motor Vehicle Roads](#motor-vehicle-roads) to [Edges](#edges) with justification<br>- Add [Climb](#climb) Field to [Steps](#steps) Edge in addition to the existing [Incline](#incline) Field<br>- Add [Opening Hours](#opening-hours) Field and include it to the existing [Building](#building) Fields<br>- Add [Generic Curb](#generic-curb) entity to [Nodes](#nodes)<br>- Add [Foot](#foot) Field to all [Edges](#edges) and [Zones](#zones)<br>- Change [Entity Type Inference](#entity-type-inference) to include the _geometry type_<br>- Fix lossiness of [Tactile Paving](#tactile-paving) Field<br>- Remove _crossing_ Field in favor of [crossing:markings](#crossing-markings) Field<br>- Add [Living Street](#living-street) to [Edges](#edges)<br>- Add _unclassified road_ to [Motor Vehicle Roads](#motor-vehicle-roads)<br>- Add _trunk road_ to [Motor Vhicle Roads](#motor-vehicle-roads)<br>- Require that the `_id` Field for all entities has at least one character |
| 0.3 | 2025-06-30 | [GitHub](https://github.com/OpenSidewalks/OpenSidewalks-Schema) | - Add support for [Custom Point](#custom-point), [Custom Line](#custom-line), and [Custom Polygon](#custom-polygon)<br>- Update the documentation to improve clarity with regards to [Adjacent Entities](#adjacent-entities) (formerly called "Extensions") |
