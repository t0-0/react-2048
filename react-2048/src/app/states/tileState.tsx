import { MergeState, MoveState } from "@/app/states/enum";

export interface TypeTileState {
  id: number;
  num: number;
  top: number;
  left: number;
  x: number;
  y: number;
  mergeState: MergeState;
  moveState: MoveState;
}
