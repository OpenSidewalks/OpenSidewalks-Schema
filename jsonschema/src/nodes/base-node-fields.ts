// All Nodes must defined an _id, serving as a unique identifier of that node.
// This comports with a graph theoretic definition of a vertex, where we need
// a way to define the node as a member of the vertex set. brunnel and layer 
// are optional but might be needed in a bare node, e.g. when we want to 
// differentiate between two overlapping nodes at different levels

import { Brunnel, Layer } from "../fields";

export type NodeID = string;

export interface BaseNodeFields {
  _id: NodeID;
  brunnel?: Brunnel;
  layer?: Layer;
}
