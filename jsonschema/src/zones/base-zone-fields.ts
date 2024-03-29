import { Foot } from "fields";
import { NodeID } from "../nodes/base-node-fields";

/**
 * @minLength 1
 */
export type ZoneID = string;

export interface BaseZoneFields {
  _id: ZoneID;
  _w_id: NodeID[];
  foot?: Foot;
}
