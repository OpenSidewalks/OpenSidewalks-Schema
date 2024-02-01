import * as ts from 'typescript';
import { resolve } from "path";
import * as TJS from "typescript-json-schema";
import * as fs from "fs";

// fetch package version from package.json
const pkg = require('../package.json')
const schemaPackageVersion = pkg.version;
const schemaVersion = schemaPackageVersion.substring(0, schemaPackageVersion.lastIndexOf(".")); // we decided to only use the major/minor parts of the package version

// pass arguments to schema generator
const settings: TJS.PartialArgs = {
    required: true,
    noExtraProps: true,
    constAsEnum: true,
    id: "https://sidewalks.washington.edu/opensidewalks/" + schemaVersion + "/schema.json"
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
}

// Allow additional fields with a prefix in "Fields" objects
addPatternProperties(schema);

// Use this library instead of JSON stringify to sort keys alphabetically for easy diff
var stringify = require("json-stable-stringify");
fs.writeFileSync("../opensidewalks.schema.json", stringify(schema, { space: "    " }));