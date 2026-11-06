"""Generate a synthetic OpenSidewalks Schema example dataset.

Input:
    ``opensidewalks.schema.json`` file in the repository root by default

Output:
    ``data\\synthetic\\osw-example-dataset-synthetic.osw.zip``

Options:
    ``--osw-schema-json`` selects an OpenSidewalks ``*.schema.json`` file
    ``--origin-lat`` and ``--origin-lon`` set the layout origin in degrees
    ``--horizontal-spacing`` sets the minimum spacing between examples
    ``--vertical-spacing`` sets the minimum spacing between category rows
    ``--overwrite`` permits replacement of an existing output
    
Examples:
    python .\\data\\synthetic\\generate-osw-example-dataset-synthetic.py

    python .\\data\\synthetic\\generate-osw-example-dataset-synthetic.py --origin-lon -122.307804 --origin-lat 47.653813 --horizontal-spacing 0.002 --vertical-spacing 0.001 --overwrite

    python .\\data\\synthetic\\generate-osw-example-dataset-synthetic.py --osw-schema-json .\\path\\to\\other.schema.json
"""

from __future__ import annotations

import argparse
import importlib
import json
import math
import sys
import tempfile
import zipfile
from decimal import Decimal, ROUND_DOWN
from pathlib import Path
from typing import Any, cast

BASE_NAME = "osw-example-dataset-synthetic"
CATEGORY_ORDER = ("nodes", "edges", "zones", "points", "lines", "polygons")
COORDINATE_QUANTUM = Decimal("0.0000001")
DEFAULT_HORIZONTAL_SPACING = 0.001
FEATURE_LENGTH_FEET = 250
FEATURE_LENGTH_METERS = FEATURE_LENGTH_FEET * 0.3048
# One degree of latitude is approximately 364,000 feet. Longitude degrees
# vary by latitude, so their delta is calculated rather than reused directly.
FEATURE_LATITUDE_DEGREES = FEATURE_LENGTH_FEET / 364_000
NETWORK_EASTERNMOST_STEP_COUNT = 9

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
    "right_steps_end": "network_right_steps_end",
    "right_sidewalk_after_steps_end": "network_right_sidewalk_after_steps_end",
    "zone_left": "network_zone_left",
    "zone_lower_left": "network_zone_lower_left",
    "zone_lower_right": "network_zone_lower_right",
    "zone_lower_right_sidewalk_end": "network_zone_lower_right_sidewalk_end",
    "zone_right": "network_zone_right",
    "zone_upper_right": "network_zone_upper_right",
    "zone_upper_right_sidewalk_end": "network_zone_upper_right_sidewalk_end",
    "zone_upper_left": "network_zone_upper_left",
    "right_sidewalk_end": "network_right_sidewalk_end",
}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Generate a synthetic OpenSidewalks Schema example dataset."
    )
    parser.add_argument(
        "--osw-schema-json",
        type=Path,
        default=Path(__file__).resolve(
        ).parents[2] / "opensidewalks.schema.json",
        metavar="PATH",
        help="Path to an OpenSidewalks *.schema.json file (default: %(default)s).",
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
    return parser


def parse_args(parser: argparse.ArgumentParser) -> argparse.Namespace:
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
    if not args.osw_schema_json.name.endswith(".schema.json"):
        parser.error("--osw-schema-json must point to a '*.schema.json' file")
    if not args.osw_schema_json.is_file():
        parser.error(
            f"--osw-schema-json is not a file: {args.osw_schema_json}")
    if not -180 <= args.origin_lon <= 180:
        parser.error("--origin-lon must be between -180 and 180 degrees")
    if not -90 < args.origin_lat < 90:
        parser.error("--origin-lat must be between -90 and 90 degrees")
    return args


def validate_layout_args(
    args: argparse.Namespace,
    category_types: dict[str, list[str]],
    geometry_by_category: dict[str, str],
    parser: argparse.ArgumentParser,
) -> None:
    effective_vertical_spacing = max(
        args.vertical_spacing, FEATURE_LATITUDE_DEGREES
    )
    row_lats = layout_row_lats(args, category_types, geometry_by_category)
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
    maximum_longitude = maximum_generated_longitude(
        args, category_types, geometry_by_category
    )
    if maximum_longitude > 180:
        parser.error(
            "the selected origin and horizontal spacing place generated geometry "
            f"at longitude {maximum_longitude:.6f}, beyond 180 degrees"
        )


def load_schema(schema_path: Path) -> dict[str, Any]:
    try:
        with schema_path.open(encoding="utf-8") as handle:
            schema = json.load(handle)
    except OSError as error:
        raise ValueError(
            f"Could not read schema file {schema_path}: {error}") from error
    except (UnicodeError, json.JSONDecodeError) as error:
        raise ValueError(
            f"Could not parse schema file {schema_path}: {error}") from error
    if not isinstance(schema, dict):
        raise ValueError(
            f"Schema file {schema_path} must contain a JSON object")
    return cast(dict[str, Any], schema)


def schema_object(value: Any, description: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ValueError(description)
    return cast(dict[str, Any], value)


def schema_feature_types(schema: dict[str, Any]) -> list[str]:
    properties = schema_object(
        schema.get("properties"), "Schema must define a properties object"
    )
    features = schema_object(
        properties.get("features"), "Schema must define a features object"
    )
    items = schema_object(
        features.get("items"), "Schema must define a features.items object"
    )
    feature_refs_value = items.get("anyOf")
    if not isinstance(feature_refs_value, list) or not feature_refs_value:
        raise ValueError(
            "Schema properties.features.items.anyOf must be a non-empty list")
    feature_refs = cast(list[Any], feature_refs_value)
    feature_types: list[str] = []
    for index, value in enumerate(feature_refs):
        feature_ref = schema_object(
            value, f"Schema feature reference {index} must be an object"
        )
        reference = feature_ref.get("$ref")
        if not isinstance(reference, str) or not reference:
            raise ValueError("Each schema feature must have a non-empty $ref")
        feature_type = reference.rsplit("/", 1)[-1]
        if not feature_type:
            raise ValueError(f"Invalid feature reference: {reference!r}")
        if feature_type in feature_types:
            raise ValueError(f"Duplicate feature reference: {feature_type}")
        feature_types.append(feature_type)
    return feature_types


def schema_feature_metadata(
    schema: dict[str, Any], feature_type: str
) -> tuple[str, dict[str, Any]]:
    definitions = schema_object(
        schema.get("definitions"), "Schema must define a definitions object"
    )
    feature_definition = schema_object(
        definitions.get(feature_type),
        f"Schema is missing the {feature_type!r} feature definition",
    )
    feature_properties = schema_object(
        feature_definition.get("properties"),
        f"Schema feature {feature_type!r} has no properties object",
    )

    geometry_schema = schema_object(
        feature_properties.get("geometry"),
        f"Schema feature {feature_type!r} must define a geometry",
    )
    geometry_reference = geometry_schema.get("$ref")
    if not isinstance(geometry_reference, str):
        raise ValueError(
            f"Schema feature {feature_type!r} must reference a geometry definition"
        )
    geometry_definition = schema_object(
        definitions.get(geometry_reference.rsplit("/", 1)[-1]),
        f"Schema feature {feature_type!r} references an unknown geometry",
    )
    geometry_properties = schema_object(
        geometry_definition.get("properties"),
        f"Schema geometry for {feature_type!r} has no properties object",
    )
    geometry_type_schema = schema_object(
        geometry_properties.get("type"),
        f"Schema geometry for {feature_type!r} must define its type",
    )
    geometry_enum_value = geometry_type_schema.get("enum")
    if isinstance(geometry_enum_value, list):
        geometry_enum = cast(list[Any], geometry_enum_value)
    else:
        geometry_enum = []
    if (
        len(geometry_enum) == 1
        and isinstance(geometry_enum[0], str)
    ):
        geometry_type = geometry_enum[0]
    elif isinstance(geometry_type_schema.get("const"), str):
        geometry_type = geometry_type_schema["const"]
    else:
        raise ValueError(
            f"Schema geometry for {feature_type!r} must have one fixed type"
        )

    fields_schema = schema_object(
        feature_properties.get("properties"),
        f"Schema feature {feature_type!r} must define Fields",
    )
    fields_reference = fields_schema.get("$ref")
    if not isinstance(fields_reference, str):
        raise ValueError(
            f"Schema feature {feature_type!r} must reference a Fields definition"
        )
    fields_definition = schema_object(
        definitions.get(fields_reference.rsplit("/", 1)[-1]),
        f"Schema feature {feature_type!r} references an unknown Fields definition",
    )
    schema_object(
        fields_definition.get("properties"),
        f"Schema Fields definition for {feature_type!r} has no properties object",
    )
    return geometry_type, fields_definition


def schema_field_properties(
    fields_definition: dict[str, Any], feature_type: str
) -> dict[str, Any]:
    return schema_object(
        fields_definition.get("properties"),
        f"Schema Fields definition for {feature_type!r} has no properties object",
    )


def resolve_schema_definition(
    schema: dict[str, Any],
    definition: dict[str, Any],
    context: str,
) -> dict[str, Any]:
    definitions = schema_object(
        schema.get("definitions"), "Schema must define a definitions object"
    )
    resolved = definition
    seen: set[str] = set()
    while "$ref" in resolved:
        reference = resolved.get("$ref")
        if not isinstance(reference, str):
            raise ValueError(
                f"Schema reference for {context} must be a string")
        definition_name = reference.rsplit("/", 1)[-1]
        if definition_name in seen:
            raise ValueError(f"Circular schema reference for {context}")
        seen.add(definition_name)
        resolved = schema_object(
            definitions.get(definition_name),
            f"Schema reference for {context} points to an unknown definition",
        )
    return resolved


def is_custom_graph_feature(
    feature_type: str, fields_definition: dict[str, Any]
) -> bool:
    # Keep custom traversable features out of the showcase while retaining
    # custom geometry examples.
    field_names = schema_field_properties(fields_definition, feature_type)
    return feature_type.lower().startswith("custom") and (
        {"_u_id", "_v_id"}.issubset(field_names)
        or "_w_id" in field_names
        or feature_type.lower().endswith("node")
    )


def schema_category_types(
    schema: dict[str, Any],
) -> tuple[dict[str, list[str]], dict[str, str]]:
    feature_types = schema_feature_types(schema)
    metadata: dict[str, tuple[str, dict[str, Any]]] = {
        feature_type: schema_feature_metadata(schema, feature_type)
        for feature_type in feature_types
    }
    # In root anyOf order, graph nodes precede edges and free points follow them.
    first_edge_index = next(
        (
            index
            for index, feature_type in enumerate(feature_types)
            if metadata[feature_type][0] == "LineString"
            and {"_u_id", "_v_id"}.issubset(
                schema_field_properties(
                    metadata[feature_type][1], feature_type
                )
            )
        ),
        None,
    )
    if first_edge_index is None:
        raise ValueError(
            "Schema feature references must include an edge with _u_id and _v_id"
        )
    node_types = feature_types[:first_edge_index]
    if not node_types or any(
        metadata[feature_type][0] != "Point" for feature_type in node_types
    ):
        raise ValueError(
            "Schema feature references must list Point node types before edge types"
        )

    category_types: dict[str, list[str]] = {
        category: [] for category in CATEGORY_ORDER
    }
    for feature_type in node_types:
        _, fields_definition = metadata[feature_type]
        if not is_custom_graph_feature(feature_type, fields_definition):
            category_types["nodes"].append(feature_type)

    for feature_type in feature_types[first_edge_index:]:
        geometry_type, fields_definition = metadata[feature_type]
        field_names = schema_field_properties(fields_definition, feature_type)
        has_u_id = "_u_id" in field_names
        has_v_id = "_v_id" in field_names
        if has_u_id != has_v_id:
            raise ValueError(
                f"Schema feature {feature_type!r} must define both _u_id and _v_id"
            )
        has_edge_ids = has_u_id and has_v_id
        has_zone_ids = "_w_id" in field_names
        if has_edge_ids and geometry_type != "LineString":
            raise ValueError(
                f"Schema feature {feature_type!r} has edge IDs but is not a LineString"
            )
        if has_zone_ids and geometry_type != "Polygon":
            raise ValueError(
                f"Schema feature {feature_type!r} has zone IDs but is not a Polygon"
            )
        if is_custom_graph_feature(feature_type, fields_definition):
            continue
        if geometry_type == "Point":
            category = "points"
        elif geometry_type == "LineString":
            category = "edges" if has_edge_ids else "lines"
        elif geometry_type == "Polygon":
            category = "zones" if has_zone_ids else "polygons"
        else:
            raise ValueError(
                f"Unsupported geometry type {geometry_type!r} for {feature_type!r}"
            )
        category_types[category].append(feature_type)

    geometry_by_category: dict[str, str] = {}
    for category, category_features in category_types.items():
        if not category_features:
            raise ValueError(
                f"Schema does not define any feature types for {category!r}"
            )
        geometries = {
            metadata[feature_type][0] for feature_type in category_features
        }
        if len(geometries) != 1:
            raise ValueError(
                f"Schema feature types in {category!r} use multiple geometries"
            )
        geometry_by_category[category] = next(iter(geometries))
    return category_types, geometry_by_category


def schema_identifying_values(
    schema: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    """Build sample values for required, non-graph fields from the schema."""
    identifying_values: dict[str, dict[str, Any]] = {}
    for feature_type in schema_feature_types(schema):
        _, fields_definition = schema_feature_metadata(schema, feature_type)
        values: dict[str, Any] = {}
        field_properties = schema_field_properties(
            fields_definition, feature_type
        )
        required_value = fields_definition.get("required", [])
        if not isinstance(required_value, list):
            raise ValueError(
                f"Schema required fields for {feature_type!r} must be a list"
            )
        required_fields = cast(list[Any], required_value)
        for value in required_fields:
            if not isinstance(value, str):
                raise ValueError(
                    f"Schema required field names for {feature_type!r} must be strings"
                )
            if value in {"_id", "_u_id", "_v_id", "_w_id"}:
                continue
            definition = schema_object(
                field_properties.get(value),
                f"Schema field {feature_type}.{value} must be an object",
            )
            definition = resolve_schema_definition(
                schema, definition, f"{feature_type}.{value}"
            )
            values[value] = representative_value(value, definition, schema)
        identifying_values[feature_type] = values
    return identifying_values


def validate_inventory(
    schema: dict[str, Any], category_types: dict[str, list[str]]
) -> None:
    documented_types = [
        feature_type
        for feature_types in category_types.values()
        for feature_type in feature_types
    ]
    documented = set(documented_types)
    expected = {
        feature_type
        for feature_type in schema_feature_types(schema)
        if not is_custom_graph_feature(
            feature_type, schema_feature_metadata(schema, feature_type)[1]
        )
    }
    if documented != expected:
        missing = sorted(expected - documented)
        extra = sorted(documented - expected)
        raise ValueError(
            f"Feature inventory mismatch; missing={missing!r}, extra={extra!r}"
        )
    if len(documented_types) != len(documented):
        raise ValueError(
            "A documented feature type is assigned more than once")


def longitude_delta_degrees(lat: float) -> float:
    cosine = math.cos(math.radians(lat))
    if cosine <= 0:
        raise ValueError("Generated geometry cannot be positioned at a pole")
    return FEATURE_LATITUDE_DEGREES / cosine


def layout_horizontal_spacing(
    args: argparse.Namespace,
    category_types: dict[str, list[str]],
    geometry_by_category: dict[str, str],
) -> float:
    row_lats = layout_row_lats(
        args, category_types, geometry_by_category
    ).values()
    return max(
        args.horizontal_spacing,
        *(longitude_delta_degrees(lat) for lat in row_lats),
    )


def layout_vertical_spacing(args: argparse.Namespace) -> float:
    return max(args.vertical_spacing, FEATURE_LATITUDE_DEGREES)


def layout_row_lats(
    args: argparse.Namespace,
    category_types: dict[str, list[str]],
    geometry_by_category: dict[str, str],
) -> dict[str, float]:
    """Return the top latitude for each showcase category row.

    Area geometries extend south from their anchor by one feature length.
    Account for that extent before placing the next row so row spacing is
    measured from the bottom of an area rather than from its top-left point.
    """
    row_lats: dict[str, float] = {}
    next_latitude = args.origin_lat
    spacing = layout_vertical_spacing(args)
    for category in category_types:
        row_lats[category] = next_latitude
        if geometry_by_category[category] == "Polygon":
            next_latitude -= FEATURE_LATITUDE_DEGREES
        next_latitude -= spacing
    return row_lats


def maximum_generated_longitude(
    args: argparse.Namespace,
    category_types: dict[str, list[str]],
    geometry_by_category: dict[str, str],
) -> float:
    """Return the easternmost longitude used by the generated dataset."""
    row_lats = layout_row_lats(args, category_types, geometry_by_category)
    horizontal_spacing = layout_horizontal_spacing(
        args, category_types, geometry_by_category
    )
    maximum = args.origin_lon
    for category, feature_types in category_types.items():
        last_anchor = args.origin_lon + (
            2 * (len(feature_types) - 1) + 1
        ) * horizontal_spacing
        if geometry_by_category[category] in {"LineString", "Polygon"}:
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
        args.origin_lon
        + NETWORK_EASTERNMOST_STEP_COUNT
        * longitude_delta_degrees(network_lat),
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


def representative_value(
    name: str, definition: dict[str, Any], schema: dict[str, Any]
) -> Any:
    definition = resolve_schema_definition(
        schema, definition, f"field {name}"
    )
    if "const" in definition:
        return definition["const"]
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
    geometry_by_category: dict[str, str],
) -> dict[str, Any]:
    return {
        "type": "Feature",
        "geometry": geometry_coordinates(
            geometry_by_category[category], lon, lat
        ),
        "properties": properties,
    }


def showcase_feature(
    feature_type: str,
    category: str,
    fields: dict[str, Any],
    schema: dict[str, Any],
    index: int,
    all_fields: bool,
    lon: float,
    lat: float,
    identifying_values: dict[str, dict[str, Any]],
    geometry_by_category: dict[str, str],
) -> dict[str, Any]:
    prefix = feature_type.lower()
    feature_id = f"showcase_{prefix}_{'all' if all_fields else 'minimal'}_{index}"
    properties: dict[str, Any] = {"_id": feature_id}
    properties.update(identifying_values.get(feature_type, {}))
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
            properties[name] = representative_value(name, definition, schema)
        properties["ext:example"] = "yes"
    return feature(
        category, properties, lon, lat, geometry_by_category
    )


def append_showcase_graph_nodes(
    outputs: dict[str, list[dict[str, Any]]],
    generated_feature: dict[str, Any],
    geometry_by_category: dict[str, str],
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
            feature(
                "nodes",
                {"_id": node_id},
                coordinates[0],
                coordinates[1],
                geometry_by_category,
            )
        )


def generate_showcase(
    schema: dict[str, Any],
    args: argparse.Namespace,
    category_types: dict[str, list[str]],
    geometry_by_category: dict[str, str],
    identifying_values: dict[str, dict[str, Any]],
) -> dict[str, list[dict[str, Any]]]:
    outputs: dict[str, list[dict[str, Any]]] = {
        category: [] for category in category_types
    }
    row_lats = layout_row_lats(args, category_types, geometry_by_category)
    horizontal_spacing = layout_horizontal_spacing(
        args, category_types, geometry_by_category
    )
    for category, feature_types in category_types.items():
        for column, feature_type in enumerate(feature_types):
            _, fields = schema_feature_metadata(schema, feature_type)
            lon = args.origin_lon + (2 * column) * horizontal_spacing
            lat = row_lats[category]
            minimal = showcase_feature(
                feature_type,
                category,
                fields,
                schema,
                column,
                False,
                lon,
                lat,
                identifying_values,
                geometry_by_category,
            )
            outputs[category].append(minimal)
            append_showcase_graph_nodes(
                outputs, minimal, geometry_by_category
            )
            all_fields = showcase_feature(
                feature_type,
                category,
                fields,
                schema,
                column,
                True,
                lon + horizontal_spacing,
                lat,
                identifying_values,
                geometry_by_category,
            )
            outputs[category].append(all_fields)
            append_showcase_graph_nodes(
                outputs, all_fields, geometry_by_category
            )
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
    identifying_values: dict[str, dict[str, Any]],
    **extra: Any,
) -> dict[str, Any]:
    validate_coordinate(lon1, lat1)
    validate_coordinate(lon2, lat2)
    properties = {"_id": feature_id, "_u_id": u_id, "_v_id": v_id}
    properties.update(identifying_values.get(feature_type, {}))
    properties.update(extra)
    return {
        "type": "Feature",
        "geometry": {"type": "LineString", "coordinates": [[lon1, lat1], [lon2, lat2]]},
        "properties": properties,
    }


def generate_network(
    outputs: dict[str, list[dict[str, Any]]],
    args: argparse.Namespace,
    category_types: dict[str, list[str]],
    geometry_by_category: dict[str, str],
    identifying_values: dict[str, dict[str, Any]],
) -> None:
    showcase_row_lats = layout_row_lats(
        args, category_types, geometry_by_category
    )
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
        "right_steps_end": (x + 8.5 * horizontal_step, lat),
        "right_sidewalk_after_steps_end": (
            x + NETWORK_EASTERNMOST_STEP_COUNT * horizontal_step,
            lat,
        ),
        "zone_lower_left": (x + 6 * horizontal_step, lat - vertical_step),
        "zone_lower_right": (x + 7 * horizontal_step, lat - vertical_step),
        "zone_lower_right_sidewalk_end": (
            x + 7.5 * horizontal_step, lat - vertical_step),
        "zone_upper_right": (x + 7 * horizontal_step, lat + vertical_step),
        "zone_upper_right_sidewalk_end": (
            x + 7.5 * horizontal_step, lat + vertical_step),
        "zone_upper_left": (x + 6 * horizontal_step, lat + vertical_step),
    }
    for node_id, (lon, node_lat) in positions.items():
        node_type = "BareNode"
        if node_id == "left_curb":
            node_type = "RaisedCurb"
        elif node_id == "right_curb":
            node_type = "CurbRamp"
        outputs["nodes"].append(
            feature(
                "nodes",
                {"_id": NETWORK_NODE_IDS[node_id], **
                    identifying_values.get(node_type, {})},
                lon,
                node_lat,
                geometry_by_category,
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
        ("Sidewalk", "network_zone_approach", "right_connector_end", "zone_left"),
        ("Footway", "network_zone_exit", "zone_right", "right_sidewalk_start"),
        ("Sidewalk", "network_zone_diagonal_sidewalk",
         "zone_left", "zone_upper_right"),
        ("Sidewalk", "network_zone_lower_right_sidewalk",
         "zone_lower_right", "zone_lower_right_sidewalk_end"),
        ("Sidewalk", "network_zone_upper_right_sidewalk",
         "zone_upper_right", "zone_upper_right_sidewalk_end"),
        ("Sidewalk", "network_right_sidewalk",
         "right_sidewalk_start", "right_sidewalk_end"),
        ("Steps", "network_right_steps", "right_sidewalk_end", "right_steps_end"),
        ("Sidewalk", "network_right_sidewalk_after_steps",
         "right_steps_end", "right_sidewalk_after_steps_end"),
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
                identifying_values,
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
                **identifying_values.get("PedestrianZone", {}),
            },
        }
    )


def truncate_coordinate_values(coordinates: Any) -> Any:
    if isinstance(coordinates, list):
        return [
            truncate_coordinate_values(value)
            for value in cast(list[Any], coordinates)
        ]
    return float(
        Decimal(str(coordinates)).quantize(
            COORDINATE_QUANTUM, rounding=ROUND_DOWN
        )
    )


def truncate_generated_coordinates(
    outputs: dict[str, list[dict[str, Any]]],
) -> None:
    for features in outputs.values():
        for generated_feature in features:
            geometry = generated_feature["geometry"]
            geometry["coordinates"] = truncate_coordinate_values(
                geometry["coordinates"]
            )


def validate_with_jsonschema(
    outputs: dict[str, list[dict[str, Any]]],
    schema: dict[str, Any],
    schema_uri: str,
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
            "$schema": schema_uri,
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


def write_archive(
    outputs: dict[str, list[dict[str, Any]]],
    output_path: Path,
    category_types: dict[str, list[str]],
    schema_uri: str,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temporary_output = output_path.with_name(f".{output_path.name}.tmp")
    if temporary_output.exists():
        temporary_output.unlink()
    with tempfile.TemporaryDirectory(prefix="osw-example-") as temp_name:
        temp_dir = Path(temp_name)
        members: list[Path] = []
        for category in category_types:
            name = f"{BASE_NAME}.{category}.geojson"
            path = temp_dir / name
            document: dict[str, Any] = {
                "$schema": schema_uri,
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
    parser = build_parser()
    args = parse_args(parser)
    directory = Path(__file__).resolve().parent
    output_path = directory / f"{BASE_NAME}.osw.zip"
    if output_path.exists() and not args.overwrite:
        print(
            f"Refusing to overwrite existing output: {output_path}\n"
            "Re-run with --overwrite if replacement is intended.",
            file=sys.stderr,
        )
        return 2
    try:
        schema = load_schema(args.osw_schema_json)
        category_types, geometry_by_category = schema_category_types(schema)
        identifying_values = schema_identifying_values(schema)
        schema_uri = schema.get("$id")
        if not isinstance(schema_uri, str) or not schema_uri:
            raise ValueError("Schema must define a non-empty $id")
        validate_inventory(schema, category_types)
    except ValueError as error:
        parser.error(str(error))
    validate_layout_args(
        args, category_types, geometry_by_category, parser
    )
    outputs = generate_showcase(
        schema,
        args,
        category_types,
        geometry_by_category,
        identifying_values,
    )
    generate_network(
        outputs,
        args,
        category_types,
        geometry_by_category,
        identifying_values,
    )
    truncate_generated_coordinates(outputs)
    validate_with_jsonschema(outputs, schema, schema_uri)
    write_archive(outputs, output_path, category_types, schema_uri)
    print(f"Created {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
