# OpenSidewalks data schema

This is the shared schema used to generation `transportation.geojson`. It is used by
OpenSidewalks for shared data (GeoJSON), map tiles (Mapbox Vector Tiles), and the
routing engine on accessmap.io. It is intended to be an extension of the OpenMapTiles
spec and uses the same licensing terms (CC-BY).

## layers

### `transportation`

This is the only way/linestring-based layer currently used by AccessMap, and it is a
direct extension of the OpenMapTiles schema.

#### Fields

##### `description`

*Unique to AccessMap*

This is *not* from the original OpenStreetMap data, but is a free-form text field
derived from spatial and other metadata, e.g. using street data one might have a
description of "NE of Main St".

##### `footway`

*Unique to AccessMap*

The original value for `footway` on OpenStreetMap. This allows differentiation between
different classes of footway. Possible values:

- `crossing`
- `sidewalk`

##### `crossing`

*Unique to AccessMap*

Values for the `crossing` key in OpenStreetMap as applied to ways. This is not the
original value, as there is fragmentation in tagging standards regarding marked
crossings and they all roughly mean the same thing. Therefore, `uncontrolled` and `
zebra` are all converted to `marked`. Possible values:

- `marked`
- `unmarked`

##### `kerb_raised`

*Unique to AccessMap*

This is an inferred quantity based on either network analysis or spatial proximity of
a crossing to lowered curbs, and should be interpreted as indicating that using this
path requires crossing over a raised curb interface. This quantity is useful for
visualization - which paths required traversing a curb? Possible values:

- 1
- 0

##### `incline`

*Unique to AccessMap*

This is *not* the original OpenStreetMap tag for incline, which would indicate the
maximum incline over a path, but is instead an estimated minimum incline based on DEM
data over the length of the path. The original OpenStreetMap `incline` tag is fairly
rare on footways to begin with. The value represents a "rise over run" estimate, i.e.
a fraction of elevation gain/loss versus distance, and is directional: a negative value
indicates downhill in the direction of the way whereas a positive value indicates
uphill.

##### `surface`

*Unique to AccessMap*

This is the original `surface` key in the OpenStreetMap data. It indicates the surface
of the way being traversed, such as concrete vs. grass. Possible values:

- `asphalt`
- `concrete`
- `gravel`
- `grass`
- `paved`
- `paving_stones`
- `unpaved`

##### `length`

*Unique to AccessMap*

This is the calculated length of the way, in meters, according to the Haversine
formula (Great-Circle Distance). This calculation is typically left up to consumers of
geometry data, as the geometry is, itself, furnished for geometrical analysis. This
is likely how AccessMap should also handle these data, but for now `length` is
precalculated.

##### `foot`

*Unique to AccessMap*

Original value of the `foot` key if it is set to yes or no. Possible values:

- 1
- 0

##### `opening_hours`

*Unique to AccessMap*

Original value of the `opening_hours` tag.

##### `elevator`

*Unique to AccessMap*

Whether the path uses an elevator for vertical movement, e.g. building paths. Possible values:

- 1
- 0

##### `width`

*Unique to AccessMap*

Original value of the `width` tag if it has no units (unit conversion not yet
supported) - implied unit is meters.

##### `layer`

The original layer tag on OpenStreetMap, this refers to the relative z-order of map
elements. This is an integer that can be negative, so e.g. layer=0 is above layer=-1.

##### `service`

The original value of the service tag on OpenStreetMap, this refers to service ways,
which includes driveways, parking lots, and alleys. Possible values:

- `alley`
- `crossover`
- `driveway`
- `parking_aisle`
- `siding`
- `spur`
- `yard`

##### `level` (not used)

This is not yet used, but should be in future specs. It is an integer indicating the
associated building level of a feature, including footways - e.g. a pathway around part
of a building.

##### `brunnel`

This contains information on the bridge/tunnel/ford tags. Possible values:

- `bridge`
- `ford`
- `tunnel`

##### `indoor`

Whether the pathways is indoor or not (this is not yet implemented). Possible values
are stated to be '1' in the OpenMapTiles spec - presumably the key doesn't exist at all
if indoor=no. Possible values:

- `1`

##### `ramp` (not used)

This is an ambiguous / undefined tag for pedestrian ways and is *not* currently used by
Accessmap. We do not use this OpenMapTiles field.

##### `subclass`

The `highway=*` subclass of the displayed way. The only values used by AccessMap are:

- `cycleway`
- `footway`
- `path`
- `pedestrian`
- `steps`

There are plans to add `corridor` for indoor routing.

### `barriers`

*Unique to AccessMap*

This is a layer not found in the OpenMapTiles spec that should, ideally, be contributed
back into separate appropriate layers. It is focused on pedestrian features that pose
potential barriers (though depending on the values, some are helpful infrastructure).
Note that all features in the `barriers` layer are points.

#### Fields

##### `kerb`

The value of the original kerb tag. Possible values:

- `flush`
- `lowered`
- `raised`
- `rolled`

##### `tactile_paving`

The value of the original `tactile_paving` tag. Possible values:

- 1
- 0
