import * as ts from 'typescript';
import { resolve } from "path";
import * as TJS from "typescript-json-schema";
import * as fs from "fs";

// fetch package version from package.json
const pkg = require('../package.json')
const schemaPackageVersion = pkg.version;
const schemaVersion = schemaPackageVersion.substring(0, schemaPackageVersion.lastIndexOf(".")); // we decided to only use the major/minor parts of the package version
const schemaURI = `https://sidewalks.washington.edu/opensidewalks/${schemaVersion}/schema.json`;

// pass arguments to schema generator
const settings: TJS.PartialArgs = {
    required: true,
    noExtraProps: true,
    constAsEnum: true
};

// pass ts compiler options to match old schema generation using command line
const compilerOptions: TJS.CompilerOptions = {
    target: ts.ScriptTarget.ES2016,
    module: ts.ModuleKind.CommonJS,
    baseUrl: "src",
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    strict: true,
    skipLibCheck: true,
    noUnusedLocals: true
};

const program = TJS.getProgramFromFiles(
  [resolve("./src/opensidewalks-feature-collection.ts")],
  compilerOptions
);

const schema = TJS.generateSchema(program, "OpenSidewalksFeatureCollection", settings);

const additionalProperties = {"^ext:.*$": {}}

function addPatternProperties(schema: any) {
  for (const key in schema["definitions"]) {
    if (key.endsWith("Fields")) {
      schema["definitions"][key]["patternProperties"] = additionalProperties;
    }
  }

  schema.$id = schemaURI;
}

// Allow additional fields with a prefix in "Fields" objects
addPatternProperties(schema);

// Use this library instead of JSON stringify to sort keys alphabetically for easy diff
var stringify = require("json-stable-stringify");
fs.writeFileSync("../opensidewalks.schema.json", stringify(schema, { space: "    " }));

// Generate per-geometry subschemas
const subSchemasDir = resolve("../subschemas");
fs.mkdirSync(subSchemasDir, { recursive: true });

const subSchemas = ["edges", "lines", "points", "nodes", "zones", "polygons"];
const toPascal = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

for (const name of subSchemas) {
  const entrypoint = resolve(`./src/${name}/opensidewalks-${name}-collection.ts`);
  const subProgram = TJS.getProgramFromFiles([entrypoint], compilerOptions);

  const candidates = [
    `OpenSidewalks${toPascal(name)}Collection`,
  ];

  const subSchema =
    candidates.map((t) => TJS.generateSchema(subProgram, t, settings)).find(Boolean) as any;

  if (!subSchema) {
    throw new Error(
      `Failed to generate schema for "${name}" from ${entrypoint}. Tried: ${candidates.join(", ")}`
    );
  }

  addPatternProperties(
    subSchema
  );
  fs.writeFileSync(
    resolve(subSchemasDir, `${name}.schema.json`),
    stringify(subSchema, { space: "    " })
  );
}