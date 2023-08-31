import json
import jsonschema
from pathlib import Path

def load_osw_schema(schema_path):
    """Load OSW Schema"""
    with open(schema_path, 'r') as file:
        schema = json.load(file)
    return schema

def load_osw_file(graph_geojson_path):
    """Load OSW Data"""
    with open(graph_geojson_path, 'r') as file:
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

workdir=".\\output"
schema_path = Path(workdir, "opensidewalks.schema.json")
region_id = "wa.microsoft"

schema = load_osw_schema(schema_path)

# validate edges
is_valid = validate_osw_errors(load_osw_file(Path(workdir, f"{region_id}.graph.edges.OSW.geojson")), schema)
print(is_valid)

# validate nodes
is_valid = validate_osw_errors(load_osw_file(Path(workdir, f"{region_id}.graph.nodes.OSW.geojson")), schema)
print(is_valid)

# validate points
is_valid = validate_osw_errors(load_osw_file(Path(workdir, f"{region_id}.graph.points.OSW.geojson")), schema)
print(is_valid)