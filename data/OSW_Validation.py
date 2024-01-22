import json
import types
import jsonschema
from pathlib import Path

def load_file(file_path):
    """Load OSW Data"""
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def validate_osw_errors(geojson_data, schema):
    """Validate OSW Data against the schema and process all errors"""
    validator = jsonschema.Draft7Validator(schema)
    errors = validator.iter_errors(geojson_data)

    error_count = 0
    for error in errors:
        error_count = error_count + 1
        #format and store in file for further review
        print(error)
    
    return error_count==0

workdir=".\\"
schema_path = Path(workdir, "opensidewalks.schema.json")
region_id = "wa.microsoft"

schema = load_file(schema_path)

graph_edges_geojson_path = Path(workdir, "data", f"{region_id}.graph.edges.OSW.geojson")
graph_nodes_geojson_path = Path(workdir, "data", f"{region_id}.graph.nodes.OSW.geojson")
graph_points_geojson_path = Path(workdir, "data", f"{region_id}.graph.points.OSW.geojson")
graph_lines_geojson_path = Path(workdir, "data", f"{region_id}.graph.lines.OSW.geojson")
graph_zones_geojson_path = Path(workdir, "data", f"{region_id}.graph.zones.OSW.geojson")
graph_polygons_geojson_path = Path(workdir, "data", f"{region_id}.graph.polygons.OSW.geojson")

print(f"Validating OSW dataset for {region_id}")
# validate edges
is_valid = validate_osw_errors(load_file(graph_edges_geojson_path), schema)
if is_valid:
    print(f"OSW edges are valid for {region_id}")
else:
    print(f"OSW edges failed validation for {region_id}")
    exit(1)

# validate nodes
is_valid = validate_osw_errors(load_file(graph_nodes_geojson_path), schema)
if is_valid:
    print(f"OSW nodes are valid for {region_id}")
else:
    print(f"OSW nodes failed validation for {region_id}")
    exit(1)

# validate points
if graph_points_geojson_path.exists():
    is_valid = validate_osw_errors(load_file(graph_points_geojson_path), schema)
    if is_valid:
        print(f"OSW points are valid for {region_id}")
    else:
        print(f"OSW points failed validation for {region_id}")
        exit(1)

# validate lines
if graph_lines_geojson_path.exists():
    is_valid = validate_osw_errors(load_file(graph_lines_geojson_path), schema)
    if is_valid:
        print(f"OSW lines are valid for {region_id}")
    else:
        print(f"OSW lines failed validation for {region_id}")
        exit(1)

# validate zones
if graph_zones_geojson_path.exists():
    is_valid = validate_osw_errors(load_file(graph_zones_geojson_path), schema)
    if is_valid:
        print(f"OSW zones are valid for {region_id}")
    else:
        print(f"OSW zones failed validation for {region_id}")
        exit(1)

# validate polygons
if graph_polygons_geojson_path.exists():
    is_valid = validate_osw_errors(load_file(graph_polygons_geojson_path), schema)
    if is_valid:
        print(f"OSW polygons are valid for {region_id}")
    else:
        print(f"OSW polygons failed validation for {region_id}")
        exit(1)