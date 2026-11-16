This project uses `typescript-json-schema` to generate a jsonschema document
from TypeScript types. This makes it simple to define types once and reuse
them across our schema. For example, the "surface" field has a single
definition and is used by all pathways.

After editing the types, run `npm run build-schema-with-extra-props` to regenerate
the main schema and all geometry-specific schemas.

Schema v0.4.0 adds roadside presence and feature attributes to road edges,
`highway=track` and `highway=cycleway` edges, and bicycle parking, street
cabinet, and public transport shelter entities. The package version controls
the generated schema ID; `CompatibleSchemaVersion` controls accepted IDs in
feature collections.
