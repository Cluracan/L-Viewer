import type { NormalisedGridLevel } from "../grid/types";
import type { DrawableRoomLevel, DrawableRoomMap } from "./types";

export const buildDrawableRooms = (
  normalisedLevels: NormalisedGridLevel[],
  canvasWidth: number,
  canvasHeight: number,
  roomSize: number,
  connectorLength: number
): DrawableRoomLevel[] => {
  return normalisedLevels.map(({ level, normalised }) => {
    const { grid, width, height } = normalised;
    const scaleFactor = roomSize + connectorLength;
    const paddingX =
      (canvasWidth - (width * roomSize + (width - 1) * connectorLength)) / 2;
    const paddingY =
      (canvasHeight - (height * roomSize + (height - 1) * connectorLength)) / 2;
    const rooms: DrawableRoomMap = {};
    grid.forEach(({ position, exits }, roomId) => {
      rooms[roomId] = {
        x: paddingX + position.x * scaleFactor,
        y: paddingY + position.y * scaleFactor,
        exits,
      };
    });
    return { level, rooms };
  });
};
