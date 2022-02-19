import { CurbRamp } from "./curb-ramp";
import { FireHydrant } from "./fire-hydrant";
import { FlushCurb } from "./flush-curb";
import { PowerPole } from "./power-pole";
import { RaisedCurb } from "./raised-curb";
import { RolledCurb } from "./rolled-curb";

export type Point =
  | CurbRamp
  | FireHydrant
  | FlushCurb
  | PowerPole
  | RaisedCurb
  | RolledCurb;
