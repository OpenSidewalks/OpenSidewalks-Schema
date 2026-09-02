"""Generate a synthetic OpenSidewalks Schema v0.3 example dataset.

Input:
    ``opensidewalks.schema.json`` file in the repository root

Output:
    ``data\\synthetic\\osw-example-dataset-synthetic.osw.zip``

Options:
    ``--origin-lat`` and ``--origin-lon`` set the layout origin in degrees
    ``--horizontal-spacing`` sets the minimum spacing between examples
    ``--vertical-spacing`` sets the minimum spacing between category rows
    ``--overwrite`` permits replacement of an existing output
    
Examples:
    python .\\data\\synthetic\\generate-osw-example-dataset-synthetic.py

    python .\\data\\synthetic\\generate-osw-example-dataset-synthetic.py --origin-lon -122.307804 --origin-lat 47.653813 --horizontal-spacing 0.002 --vertical-spacing 0.001 --overwrite
"""

from __future__ import annotations

import argparse
import importlib
import json
import math
import sys
import tempfile
import zipfile
from pathlib import Path
from typing import Any

BASE_NAME = "osw-example-dataset-synthetic"
SCHEMA_URI = "https://sidewalks.washington.edu/opensidewalks/0.3/schema.json"
DEFAULT_HORIZONTAL_SPACING = 0.001
FEATURE_LENGTH_FEET = 250
FEATURE_LENGTH_METERS = FEATURE_LENGTH_FEET * 0.3048
# One degree of latitude is approximately 364,000 feet. Longitude degrees
# vary by latitude, so their delta is calculated rather than reused directly.
FEATURE_LATITUDE_DEGREES = FEATURE_LENGTH_FEET / 364_000

CATEGORY_TYPES: dict[str, list[str]] = {
    "nodes": [
        "BareNode",
        "GenericCurb",
        "RaisedCurb",
        "RolledCurb",
        "CurbRamp",
        "FlushCurb",
    ],
    "edges": [
        "Footway",
        "Crossing",
        "Sidewalk",
        "TrafficIsland",
        "Steps",
        "Pedestrian",
        "PrimaryStreet",
        "SecondaryStreet",
        "TertiaryStreet",
        "ResidentialStreet",
        "ServiceRoad",
        "Alley",
        "Driveway",
        "ParkingAisle",
        "TrunkRoad",
        "UnclassifiedRoad",
        "LivingStreet",
    ],
    "zones": ["PedestrianZone"],
    "points": [
        "PowerPole",
        "FireHydrant",
        "Bench",
        "Bollard",
        "Manhole",
        "StreetLamp",
        "WasteBasket",
        "Tree",
        "CustomPoint",
    ],
    "lines": ["Fence", "TreeRow", "CustomLine"],
    "polygons": ["Building", "Wood", "CustomPolygon"],
}

GEOMETRY_BY_CATEGORY = {
    "nodes": "Point",
    "edges": "LineString",
    "zones": "Polygon",
    "points": "Point",
    "lines": "LineString",
    "polygons": "Polygon",
}

IDENTIFYING_VALUES: dict[str, dict[str, Any]] = {
    "GenericCurb": {"barrier": "kerb"},
    "RaisedCurb": {"barrier": "kerb", "kerb": "raised"},
    "RolledCurb": {"barrier": "kerb", "kerb": "rolled"},
    "CurbRamp": {"barrier": "kerb", "kerb": "lowered"},
    "FlushCurb": {"barrier": "kerb", "kerb": "flush"},
    "Footway": {"highway": "footway"},
    "Crossing": {"highway": "footway", "footway": "crossing"},
    "Sidewalk": {"highway": "footway", "footway": "sidewalk"},
    "TrafficIsland": {"highway": "footway", "footway": "traffic_island"},
    "Steps": {"highway": "steps"},
    "Pedestrian": {"highway": "pedestrian"},
    "PrimaryStreet": {"highway": "primary"},
    "SecondaryStreet": {"highway": "secondary"},
    "TertiaryStreet": {"highway": "tertiary"},
    "ResidentialStreet": {"highway": "residential"},
    "ServiceRoad": {"highway": "service"},
    "Alley": {"highway": "service", "service": "alley"},
    "Driveway": {"highway": "service", "service": "driveway"},
    "ParkingAisle": {"highway": "service", "service": "parking_aisle"},
    "TrunkRoad": {"highway": "trunk"},
    "UnclassifiedRoad": {"highway": "unclassified"},
    "LivingStreet": {"highway": "living_street"},
    "PedestrianZone": {"highway": "pedestrian"},
    "PowerPole": {"power": "pole"},
    "FireHydrant": {"emergency": "fire_hydrant"},
    "Bench": {"amenity": "bench"},
    "Bollard": {"barrier": "bollard"},
    "Manhole": {"man_made": "manhole"},
    "StreetLamp": {"highway": "street_lamp"},
    "WasteBasket": {"amenity": "waste_basket"},
    "Tree": {"natural": "tree"},
    "Fence": {"barrier": "fence"},
    "TreeRow": {"natural": "tree_row"},
    "Building": {"building": "civic"},
    "Wood": {"natural": "wood"},
}

NETWORK_NODE_IDS = {
    "left_sidewalk_end": "network_left_sidewalk_end",
    "left_connector_end": "network_left_connector_end",
    "left_curb": "network_left_curb",
    "road_center": "network_road_center",
    "road_north_end": "network_road_north_end",
    "road_south_end": "network_road_south_end",
    "right_curb": "network_right_curb",
    "right_connector_end": "network_right_connector_end",
    "right_sidewalk_start": "network_right_sidewalk_start",
    "zone_left": "network_zone_left",
    "zone_lower_left": "network_zone_lower_left",
    "zone_lower_right": "network_zone_lower_right",
    "zone_right": "network_zone_right",
    "zone_upper_right": "network_zone_upper_right",
    "zone_upper_left": "network_zone_upper_left",
    "right_sidewalk_end": "network_right_sidewalk_end",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate a synthetic OpenSidewalks Schema v0.3 example dataset."
    )
    parser.add_argument("--origin-lon", type=float, default=0.0)
    parser.add_argument("--origin-lat", type=float, default=0.0)
    parser.add_argument(
        "--horizontal-spacing",
        type=float,
        default=DEFAULT_HORIZONTAL_SPACING,
        help="Minimum spacing between showcase examples in degrees.",
    )
    parser.add_argument(
        "--vertical-spacing",
        type=float,
        help="Minimum spacing between showcase rows in degrees.",
    )
    parser.add_argument("--overwrite", action="store_true")
    args = parser.parse_args()
    if not math.isfinite(args.origin_lon) or not math.isfinite(args.origin_lat):
        parser.error("origin coordinates must be finite numbers")
    if not math.isfinite(args.horizontal_spacing):
        parser.error("--horizontal-spacing must be a finite number")
    if args.horizontal_spacing <= 0:
        parser.error("--horizontal-spacing must be greater than zero")
    if args.vertical_spacing is not None and not math.isfinite(args.vertical_spacing):
        parser.error("--vertical-spacing must be a finite number")
    if args.vertical_spacing is not None and args.vertical_spacing <= 0:
        parser.error("--vertical-spacing must be greater than zero")
    args.vertical_spacing = args.vertical_spacing or 2 * args.horizontal_spacing
    if not -180 <= args.origin_lon <= 180:
        parser.error("--origin-lon must be between -180 and 180 degrees")
    if not -90 < args.origin_lat < 90:
        parser.error("--origin-lat must be between -90 and 90 degrees")
    effective_vertical_spacing = max(
        args.vertical_spacing, FEATURE_LATITUDE_DEGREES
    )
    row_lats = layout_row_lats(args)
    network_lat = (
        row_lats["polygons"]
        - FEATURE_LATITUDE_DEGREES
        - effective_vertical_spacing
    )
    lowest_latitude = network_lat - 2 * FEATURE_LATITUDE_DEGREES
    if lowest_latitude <= -90:
        parser.error(
            "the selected origin and vertical spacing place generated geometry "
            "at or below the South Pole"
        )
    maximum_longitude = maximum_generated_longitude(args)
    if maximum_longitude > 180:
        parser.error(
            "the selected origin and horizontal spacing place generated geometry "
            f"at longitude {maximum_longitude:.6f}, beyond 180 degrees"
        )
    return args


def load_schema(schema_path: Path) -> dict[str, Any]:
    with schema_path.open(encoding="utf-8") as handle:
        return json.load(handle)


def schema_feature_types(schema: dict[str, Any]) -> set[str]:
    return {
        ref["$ref"].rsplit("/", 1)[1]
        for ref in schema["properties"]["features"]["items"]["anyOf"]
    }


def validate_inventory(schema: dict[str, Any]) -> None:
    documented = {feature for features in CATEGORY_TYPES.values()
                  for feature in features}
    expected = schema_feature_types(
        schema) - {"CustomEdge", "CustomNode", "CustomZone"}
    if documented != expected:
        missing = sorted(expected - documented)
        extra = sorted(documented - expected)
        raise ValueError(
            f"Feature inventory mismatch; missing={missing!r}, extra={extra!r}"
        )
    if len(documented) != sum(len(features) for features in CATEGORY_TYPES.values()):
        raise ValueError(
            "A documented feature type is assigned more than once")


def longitude_delta_degrees(lat: float) -> float:
    cosine = math.cos(math.radians(lat))
    if cosine <= 0:
        raise ValueError("Generated geometry cannot be positioned at a pole")
    return FEATURE_LATITUDE_DEGREES / cosine


def layout_horizontal_spacing(args: argparse.Namespace) -> float:
    row_lats = layout_row_lats(args).values()
    return max(
        args.horizontal_spacing,
        *(longitude_delta_degrees(lat) for lat in row_lats),
    )


def layout_vertical_spacing(args: argparse.Namespace) -> float:
    return max(args.vertical_spacing, FEATURE_LATITUDE_DEGREES)


def layout_row_lats(args: argparse.Namespace) -> dict[str, float]:
    """Return the top latitude for each showcase category row.

    Area geometries extend south from their anchor by one feature length.
    Account for that extent before placing the next row so row spacing is
    measured from the bottom of an area rather than from its top-left point.
    """
    row_lats: dict[str, float] = {}
    next_latitude = args.origin_lat
    spacing = layout_vertical_spacing(args)
    for category in CATEGORY_TYPES:
        row_lats[category] = next_latitude
        if GEOMETRY_BY_CATEGORY[category] == "Polygon":
            next_latitude -= FEATURE_LATITUDE_DEGREES
        next_latitude -= spacing
    return row_lats


def maximum_generated_longitude(args: argparse.Namespace) -> float:
    """Return the easternmost longitude used by the generated dataset."""
    row_lats = layout_row_lats(args)
    horizontal_spacing = layout_horizontal_spacing(args)
    maximum = args.origin_lon
    for category, feature_types in CATEGORY_TYPES.items():
        last_anchor = args.origin_lon + (
            2 * (len(feature_types) - 1) + 1
        ) * horizontal_spacing
        if GEOMETRY_BY_CATEGORY[category] in {"LineString", "Polygon"}:
            last_anchor += longitude_delta_degrees(row_lats[category])
        maximum = max(maximum, last_anchor)

    network_north_lat = (
        row_lats["polygons"]
        - FEATURE_LATITUDE_DEGREES
        - layout_vertical_spacing(args)
    )
    network_lat = network_north_lat - FEATURE_LATITUDE_DEGREES
    maximum = max(
        maximum,
        args.origin_lon + 8 * longitude_delta_degrees(network_lat),
    )
    return maximum


def geometry_coordinates(geometry: str, lon: float, lat: float) -> dict[str, Any]:
    longitude_length = longitude_delta_degrees(lat)
    if geometry == "Point":
        validate_coordinate(lon, lat)
        return {"type": "Point", "coordinates": [lon, lat]}
    if geometry == "LineString":
        validate_coordinate(lon, lat)
        validate_coordinate(lon + longitude_length, lat)
        return {
            "type": "LineString",
            "coordinates": [[lon, lat], [lon + longitude_length, lat]],
        }
    if geometry == "Polygon":
        validate_coordinate(lon, lat)
        validate_coordinate(lon + longitude_length, lat -
                            FEATURE_LATITUDE_DEGREES)
        ring = [
            [lon, lat],
            [lon, lat - FEATURE_LATITUDE_DEGREES],
            [lon + longitude_length, lat - FEATURE_LATITUDE_DEGREES],
            [lon + longitude_length, lat],
            [lon, lat],
        ]
        return {
            "type": "Polygon",
            "coordinates": [ring],
        }
    raise ValueError(f"Unsupported geometry: {geometry}")


def validate_coordinate(lon: float, lat: float) -> None:
    if not -180 <= lon <= 180 or not -90 <= lat <= 90:
        raise ValueError(
            f"Generated coordinate ({lon}, {lat}) is outside WGS-84 bounds"
        )


def representative_value(name: str, definition: dict[str, Any]) -> Any:
    if "enum" in definition:
        return definition["enum"][0]
    if name == "opening_hours":
        return "Mo-Fr 09:00-17:00"
    if name == "length":
        return FEATURE_LENGTH_METERS
    if definition.get("type") == "integer":
        return max(definition.get("minimum", 1), 3)
    if definition.get("type") == "number":
        minimum = definition.get("minimum", 0.0)
        maximum = definition.get("maximum")
        value = minimum if minimum > 0 else 0.25
        if maximum is not None:
            value = min(value, maximum)
        return value
    return f"synthetic_{name.replace(':', '_')}"


def feature(
    category: str,
    properties: dict[str, Any],
    lon: float,
    lat: float,
) -> dict[str, Any]:
    return {
        "type": "Feature",
        "geometry": geometry_coordinates(GEOMETRY_BY_CATEGORY[category], lon, lat),
        "properties": properties,
    }


def showcase_feature(
    feature_type: str,
    category: str,
    fields: dict[str, Any],
    index: int,
    all_fields: bool,
    lon: float,
    lat: float,
) -> dict[str, Any]:
    prefix = feature_type.lower()
    feature_id = f"showcase_{prefix}_{'all' if all_fields else 'minimal'}_{index}"
    properties: dict[str, Any] = {"_id": feature_id}
    properties.update(IDENTIFYING_VALUES.get(feature_type, {}))
    if "_u_id" in fields["properties"]:
        properties["_u_id"] = f"{feature_id}_u"
        properties["_v_id"] = f"{feature_id}_v"
    if "_w_id" in fields["properties"]:
        properties["_w_id"] = [f"{feature_id}_w{index}" for index in range(4)]
    if feature_type == "CustomPoint":
        properties["_id"] = f"showcase_custom_point_{'all' if all_fields else 'minimal'}_{index}"
    elif feature_type == "CustomLine":
        properties["_id"] = f"showcase_custom_line_{'all' if all_fields else 'minimal'}_{index}"
    elif feature_type == "CustomPolygon":
        properties["_id"] = f"showcase_custom_polygon_{'all' if all_fields else 'minimal'}_{index}"
    if all_fields:
        for name, definition in fields["properties"].items():
            if name in properties or name == "_id":
                continue
            properties[name] = representative_value(name, definition)
        properties["ext:example"] = "yes"
    return feature(category, properties, lon, lat)


def append_showcase_graph_nodes(
    outputs: dict[str, list[dict[str, Any]]], generated_feature: dict[str, Any]
) -> None:
    properties = generated_feature["properties"]
    geometry = generated_feature["geometry"]
    endpoint_nodes: list[tuple[str, list[float]]] = []
    if "_u_id" in properties and "_v_id" in properties:
        coordinates = geometry["coordinates"]
        endpoint_nodes = [
            (properties["_u_id"], coordinates[0]),
            (properties["_v_id"], coordinates[-1]),
        ]
    elif "_w_id" in properties:
        ring = geometry["coordinates"][0]
        endpoint_nodes = list(zip(properties["_w_id"], ring[:-1]))
    for node_id, coordinates in endpoint_nodes:
        outputs["nodes"].append(
            feature("nodes", {"_id": node_id}, coordinates[0], coordinates[1])
        )


def generate_showcase(schema: dict[str, Any], args: argparse.Namespace) -> dict[str, list[dict[str, Any]]]:
    outputs: dict[str, list[dict[str, Any]]] = {
        category: [] for category in CATEGORY_TYPES
    }
    row_lats = layout_row_lats(args)
    horizontal_spacing = layout_horizontal_spacing(args)
    for category, feature_types in CATEGORY_TYPES.items():
        for column, feature_type in enumerate(feature_types):
            fields = schema["definitions"][feature_type + "Fields"]
            lon = args.origin_lon + (2 * column) * horizontal_spacing
            lat = row_lats[category]
            minimal = showcase_feature(
                feature_type, category, fields, column, False, lon, lat
            )
            outputs[category].append(minimal)
            append_showcase_graph_nodes(outputs, minimal)
            all_fields = showcase_feature(
                feature_type,
                category,
                fields,
                column,
                True,
                lon + horizontal_spacing,
                lat,
            )
            outputs[category].append(all_fields)
            append_showcase_graph_nodes(outputs, all_fields)
    return outputs


def network_feature(
    feature_type: str,
    feature_id: str,
    u_id: str,
    v_id: str,
    lon1: float,
    lat1: float,
    lon2: float,
    lat2: float,
    **extra: Any,
) -> dict[str, Any]:
    validate_coordinate(lon1, lat1)
    validate_coordinate(lon2, lat2)
    properties = {"_id": feature_id, "_u_id": u_id, "_v_id": v_id}
    properties.update(IDENTIFYING_VALUES[feature_type])
    properties.update(extra)
    return {
        "type": "Feature",
        "geometry": {"type": "LineString", "coordinates": [[lon1, lat1], [lon2, lat2]]},
        "properties": properties,
    }


def generate_network(outputs: dict[str, list[dict[str, Any]]], args: argparse.Namespace) -> None:
    showcase_row_lats = layout_row_lats(args)
    vertical_step = FEATURE_LATITUDE_DEGREES
    network_north_lat = (
        showcase_row_lats["polygons"]
        - vertical_step
        - layout_vertical_spacing(args)
    )
    lat = network_north_lat - vertical_step
    x = args.origin_lon
    horizontal_step = longitude_delta_degrees(lat)
    connector_step = horizontal_step / 2
    positions = {
        "left_sidewalk_end": (x, lat),
        "left_connector_end": (x + 2 * horizontal_step - connector_step, lat),
        "left_curb": (x + 2 * horizontal_step, lat),
        "road_center": (x + 3 * horizontal_step, lat),
        "road_north_end": (x + 3 * horizontal_step, network_north_lat),
        "road_south_end": (x + 3 * horizontal_step, lat - vertical_step),
        "right_curb": (x + 4 * horizontal_step, lat),
        "right_connector_end": (x + 4 * horizontal_step + connector_step, lat),
        "zone_left": (x + 6 * horizontal_step, lat),
        "zone_right": (x + 7 * horizontal_step, lat),
        "right_sidewalk_start": (x + 7.5 * horizontal_step, lat),
        "right_sidewalk_end": (x + 8 * horizontal_step, lat),
        "zone_lower_left": (x + 6 * horizontal_step, lat - vertical_step),
        "zone_lower_right": (x + 7 * horizontal_step, lat - vertical_step),
        "zone_upper_right": (x + 7 * horizontal_step, lat + vertical_step),
        "zone_upper_left": (x + 6 * horizontal_step, lat + vertical_step),
    }
    for node_id, (lon, node_lat) in positions.items():
        node_type = "BareNode"
        if node_id in {"left_curb", "right_curb"}:
            node_type = "CurbRamp"
        outputs["nodes"].append(
            feature(
                "nodes",
                {"_id": NETWORK_NODE_IDS[node_id], **
                    IDENTIFYING_VALUES.get(node_type, {})},
                lon,
                node_lat,
            )
        )
    edges = [
        ("Sidewalk", "network_left_sidewalk",
         "left_sidewalk_end", "left_connector_end"),
        ("Footway", "network_left_connector", "left_connector_end", "left_curb"),
        ("Crossing", "network_left_crossing", "left_curb", "road_center"),
        ("ResidentialStreet", "network_road_north", "road_center", "road_north_end"),
        ("ResidentialStreet", "network_road_south", "road_south_end", "road_center"),
        ("Crossing", "network_right_crossing", "road_center", "right_curb"),
        ("Footway", "network_right_connector",
         "right_curb", "right_connector_end"),
        ("Footway", "network_zone_approach", "right_connector_end", "zone_left"),
        ("Footway", "network_zone_exit", "zone_right", "right_sidewalk_start"),
        ("Sidewalk", "network_right_sidewalk",
         "right_sidewalk_start", "right_sidewalk_end"),
    ]
    for feature_type, edge_id, start, end in edges:
        start_lon, start_lat = positions[start]
        end_lon, end_lat = positions[end]
        outputs["edges"].append(
            network_feature(
                feature_type,
                edge_id,
                NETWORK_NODE_IDS[start],
                NETWORK_NODE_IDS[end],
                start_lon,
                start_lat,
                end_lon,
                end_lat,
            )
        )
    zone_lat = lat
    zone_coordinates: list[list[float]] = [
        [x + 6 * horizontal_step, zone_lat],
        [x + 6 * horizontal_step, zone_lat - vertical_step],
        [x + 7 * horizontal_step, zone_lat - vertical_step],
        [x + 7 * horizontal_step, zone_lat],
        [x + 7 * horizontal_step, zone_lat + vertical_step],
        [x + 6 * horizontal_step, zone_lat + vertical_step],
        [x + 6 * horizontal_step, zone_lat],
    ]
    for lon, zone_vertex_lat in zone_coordinates:
        validate_coordinate(lon, zone_vertex_lat)
    outputs["zones"].append(
        {
            "type": "Feature",
            "geometry": {"type": "Polygon", "coordinates": [zone_coordinates]},
            "properties": {
                "_id": "network_pedestrian_zone",
                "_w_id": [
                    NETWORK_NODE_IDS["zone_left"],
                    NETWORK_NODE_IDS["zone_lower_left"],
                    NETWORK_NODE_IDS["zone_lower_right"],
                    NETWORK_NODE_IDS["zone_right"],
                    NETWORK_NODE_IDS["zone_upper_right"],
                    NETWORK_NODE_IDS["zone_upper_left"],
                ],
                "highway": "pedestrian",
            },
        }
    )


def validate_with_jsonschema(
    outputs: dict[str, list[dict[str, Any]]], schema: dict[str, Any]
) -> None:
    try:
        jsonschema: Any = importlib.import_module("jsonschema")
    except ImportError:
        print("Warning: jsonschema is unavailable; skipping local schema self-check.", file=sys.stderr)
        return
    validator: Any = jsonschema.Draft7Validator(schema)
    errors: list[str] = []
    for category, features in outputs.items():
        document: dict[str, Any] = {
            "$schema": SCHEMA_URI,
            "type": "FeatureCollection",
            "features": features,
        }
        for error in validator.iter_errors(document):
            path = ".".join(str(part) for part in error.absolute_path)
            errors.append(f"{category}: {path}: {error.message}")
    if errors:
        raise ValueError(
            "Generated data failed the local schema self-check:\n" + "\n".join(errors))
    print("Local schema self-check passed.")


def write_archive(outputs: dict[str, list[dict[str, Any]]], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temporary_output = output_path.with_name(f".{output_path.name}.tmp")
    if temporary_output.exists():
        temporary_output.unlink()
    with tempfile.TemporaryDirectory(prefix="osw-example-") as temp_name:
        temp_dir = Path(temp_name)
        members: list[Path] = []
        for category in CATEGORY_TYPES:
            name = f"{BASE_NAME}.{category}.geojson"
            path = temp_dir / name
            document: dict[str, Any] = {
                "$schema": SCHEMA_URI,
                "type": "FeatureCollection",
                "features": outputs[category],
            }
            path.write_text(json.dumps(document, indent=2) +
                            "\n", encoding="utf-8")
            members.append(path)
        try:
            with zipfile.ZipFile(
                temporary_output, "w", compression=zipfile.ZIP_DEFLATED
            ) as archive:
                for member in members:
                    archive.write(member, arcname=member.name)
            temporary_output.replace(output_path)
        finally:
            if temporary_output.exists():
                temporary_output.unlink()


def main() -> int:
    args = parse_args()
    directory = Path(__file__).resolve().parent
    schema_path = directory.parents[1] / "opensidewalks.schema.json"
    output_path = directory / f"{BASE_NAME}.osw.zip"
    if output_path.exists() and not args.overwrite:
        print(
            f"Refusing to overwrite existing output: {output_path}\n"
            "Re-run with --overwrite if replacement is intended.",
            file=sys.stderr,
        )
        return 2
    schema = load_schema(schema_path)
    validate_inventory(schema)
    outputs = generate_showcase(schema, args)
    generate_network(outputs, args)
    validate_with_jsonschema(outputs, schema)
    write_archive(outputs, output_path)
    print(f"Created {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
