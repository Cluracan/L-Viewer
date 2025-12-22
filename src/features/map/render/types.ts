import type { RoomId } from "../../../assets/data/roomData";
import type { GridDirection } from "../grid/types";

export type DrawableRoom = {
  x: number;
  y: number;
  exits: Set<GridDirection>;
};

export type DrawableRoomMap = Partial<Record<RoomId, DrawableRoom>>;

export type DrawableRoomLevel = {
  level: string;
  rooms: DrawableRoomMap;
};

export type MapRendererConfig = {
  width: number;
  height: number;
  roomSize: number;
  connectorLength: number;
  roomCornerRadius: number;
};
