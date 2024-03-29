import { Foot } from "fields";
import { NodeID } from "../nodes/base-node-fields";

/**
 * @minLength 1
 */
export type EdgeID = string;

export interface BaseEdgeFields {
  _id: EdgeID;
  _u_id: NodeID;
  _v_id: NodeID;
  foot?: Foot;
}
