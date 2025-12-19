import type { NormalisedRoomGrid, RawRoomGrid } from "./types";

type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export const normaliseGrid = (roomGridMap: RawRoomGrid): NormalisedRoomGrid => {
  const bounds: Bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  for (const { position } of roomGridMap.values()) {
    bounds.minX = Math.min(bounds.minX, position.x);
    bounds.maxX = Math.max(bounds.maxX, position.x);
    bounds.minY = Math.min(bounds.minY, position.y);
    bounds.maxY = Math.max(bounds.maxY, position.y);
  }

  const shiftX = -bounds.minX;
  const shiftY = -bounds.minY;
  const height = bounds.maxY - bounds.minY + 1;
  const width = bounds.maxX - bounds.minX + 1;
  const normalisedGrid: RawRoomGrid = new Map();
  for (const [
    roomId,
    { position: gridPosition, exits },
  ] of roomGridMap.entries()) {
    normalisedGrid.set(roomId, {
      position: { x: gridPosition.x + shiftX, y: gridPosition.y + shiftY },
      exits,
    });
  }
  return { height, width, grid: normalisedGrid };
};
