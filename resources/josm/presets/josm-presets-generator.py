# Name: OpenSidewalks Schema JOSM Preset Generator
# Version: 1.0
# Description: This Python script generates a JOSM preset XML file based on the OpenSidewalks schema.
# Author: Ryan Liu, Amy Bordenave (Taskar Center for Accessible Technology, University of Washington)
# Date: 2025-06-13
# License: CC-BY-ND 4.0 International

import os
import re
import argparse
import xml.etree.ElementTree as ET
from pathlib import Path

# Mapping for display values
DISPLAY_VALUE_OVERRIDES = {
    "no": "None",
    "colour": "Color"
}


def format_name(name):
    return ' '.join(word.capitalize() for word in name.replace('-', ' ').split())


def extract_last_comment(content):
    comments = re.findall(r'/\*\*(.*?)\*/', content, re.DOTALL)
    if comments:
        return comments[-1].strip().replace('\n', ' ')
    return ""


def extract_identifying_fields(content):
    match = re.search(
        r'interface\s+\w+IdentifyingFields\s+extends\s+\w+\s*{(.*?)}', content, re.DOTALL)
    fields = {}
    if match:
        lines = match.group(1).split('\n')
        for line in lines:
            line = line.strip().rstrip(',;')
            if ':' in line:
                key, value = map(str.strip, line.split(':'))
                fields[key] = value.strip('"').replace('&quot;', '')
    return fields


def extract_additional_fields(content):
    match = re.search(
        r'interface\s+\w+Fields\s+extends\s+[\w, ]+\s*{(.*?)}', content, re.DOTALL)
    fields = {}
    if match:
        lines = match.group(1).split('\n')
        for line in lines:
            line = line.strip().rstrip(',;')
            if ':' in line:
                key, value = map(str.strip, line.split(':'))
                fields[key.strip('"')] = value.strip().replace('&quot;', '')
    return fields


def process_ts_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    label_text = extract_last_comment(content)
    identifying_fields = extract_identifying_fields(content)
    additional_fields = extract_additional_fields(content)

    return label_text, identifying_fields, additional_fields


def create_combo_element(key, value, display_value, default_value):
    combo = ET.Element('combo')
    combo.set('key', key)
    combo.set('text', format_name(key))
    combo.set('values', value)
    combo.set('display_values', display_value)
    combo.set('default', default_value)
    combo.set('editable', 'false')
    return combo


def determine_type(group_name):
    name = group_name.lower()
    if 'zone' in name or 'polygon' in name:
        return "closedway,multipolygon"
    elif 'node' in name or 'point' in name:
        return "node"
    elif 'edge' in name or 'line' in name:
        return "way,closedway"
    return ""


def generate_preset(schema_version, schema_root, output_file):
    preset = ET.Element(
        'presets', xmlns="http://josm.openstreetmap.de/tagging-preset-1.0")

    top_group = ET.SubElement(preset, 'group')
    top_group.set('name', f"OpenSidewalks {schema_version}")

    src_path = Path(schema_root) / 'jsonschema' / 'src'
    for group_dir in src_path.iterdir():
        if group_dir.is_dir():
            group = ET.SubElement(top_group, 'group')
            group.set('name', format_name(group_dir.name))

            for ts_file in group_dir.glob('*.ts'):
                if 'base-' in ts_file.name or ts_file.name == 'index.ts':
                    continue  # Skip base-*-fields.ts and index.ts

                item = ET.SubElement(group, 'item')
                item_name = format_name(ts_file.stem)
                item.set('name', item_name)
                item.set('icon', '')
                item.set('type', determine_type(group_dir.name))

                label_text, identifying_fields, additional_fields = process_ts_file(
                    ts_file)
                label = ET.SubElement(item, 'label')
                label.set('text', label_text)

                for key, value in identifying_fields.items():
                    display_value = DISPLAY_VALUE_OVERRIDES.get(
                        value, format_name(value))
                    combo = create_combo_element(
                        key, value, display_value, value)
                    item.append(combo)

                for key, value in additional_fields.items():
                    if value == 'CrossingMarkings':
                        markings = [
                            "dashes", "dots", "ladder", "ladder:paired", "lines", "lines:paired", "no",
                            "skewed", "surface", "yes", "zebra", "zebra:bicolour", "zebra:double",
                            "zebra:paired", "rainbow", "lines:rainbow", "zebra:rainbow",
                            "ladder:skewed", "pictograms"
                        ]
                        display_values = [DISPLAY_VALUE_OVERRIDES.get(
                            m, format_name(m.replace(':', ' '))) for m in markings]
                        combo = ET.Element('combo')
                        combo.set('key', key)
                        combo.set('text', format_name(key))
                        combo.set('values', ','.join(markings))
                        combo.set('display_values', ','.join(display_values))
                        combo.set('default', '')
                        combo.set('editable', 'false')
                        item.append(combo)

    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    tree = ET.ElementTree(preset)
    ET.indent(tree, space="  ", level=0)
    tree.write(output_file, encoding='utf-8', xml_declaration=True)
    print(f"JOSM preset generated at: {output_file}")


# Entry point
if __name__ == "__main__":
    script_dir = Path(__file__).resolve()
    schema_root = script_dir.parents[3]
    schema_version = "0.2"
    output_file = schema_root / "resources" / \
        "josm" / "presets" / "opensidewalks.xml"

    generate_preset(schema_version, str(schema_root), str(output_file))
