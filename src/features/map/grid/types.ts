import type { RoomId } from "../../../assets/data/roomData";
import type { gridDirectionOffsets } from "./buildRoomGrid";

export type GridPosition = {
  x: number;
  y: number;
};

export type GridDirection = keyof typeof gridDirectionOffsets;

export type RoomGridNode = {
  position: GridPosition;
  exits: Set<GridDirection>;
};

export type RawRoomGrid = Map<RoomId, RoomGridNode>;

export type NormalisedRoomGrid = {
  grid: RawRoomGrid;
  width: number;
  height: number;
};
