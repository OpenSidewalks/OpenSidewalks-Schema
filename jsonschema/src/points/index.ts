// Points are geospatial point features that are not explicitly associated with
// the graph. They are still of interest to pedestrian datasets, however, and
// may be queried relative to the graph using spatial relationships, e.g.
// "all fire hydrants within 3 meters of this sidewalk".

import { FireHydrant } from "./fire-hydrant";
import { PowerPole } from "./power-pole";

export type Point =
  | FireHydrant
  | PowerPole;
