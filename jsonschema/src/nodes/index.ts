// Nodes are networky/graphy: they contain a unique identifier that is
// referenced by edges. This is in contrast to Points, which are free-floating
// geospatial elements and not an explicit part of the graph structure.

// TODO: Create a derived Feature type that requires an extension of the
// required Node fields.
import { BareNode } from "./bare-node";
import { CurbRamp } from "./curb-ramp";
import { FlushCurb } from "./flush-curb";
import { GenericCurb } from "./generic-curb";
import { RaisedCurb } from "./raised-curb";
import { RolledCurb } from "./rolled-curb";

export type Node = BareNode | CurbRamp | FlushCurb | RaisedCurb | RolledCurb | GenericCurb;
