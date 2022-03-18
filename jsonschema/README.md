This project uses `typescript-json-schema` to generate a jsonschema document
from TypeScript types. This makes it simple to define types once and reuse
them across our schema. For example, the "surface" field has a single
definition and is used by all pathways.

After editing the types, run `npm run build-schema` to create a new jsonschema.
