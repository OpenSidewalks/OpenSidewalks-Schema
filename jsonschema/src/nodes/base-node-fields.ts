// All Nodes must defined an _id, serving as a unique identifier of that node.
// This comports with a graph theoretic definition of a vertex, where we need
// a way to define the node as a member of the vertex set.

export type NodeID = string;

export interface BaseNodeFields {
  _id: NodeID;
}
