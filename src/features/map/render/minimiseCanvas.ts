import type { NormalisedGridLevel } from "../grid/types";

export const minimiseCanvas = (
  roomSize: number,
  connectorLength: number,
  padding: number,
  normalisedLevels: NormalisedGridLevel[]
) => {
  let minFitWidth = 0;
  let minFitHeight = 0;
  normalisedLevels.forEach((level) => {
    const xRoomCount = level.normalised.width;
    const yRoomCount = level.normalised.height;
    minFitWidth = Math.max(
      minFitWidth,
      calculateMinLength(roomSize, connectorLength, xRoomCount, padding)
    );
    minFitHeight = Math.max(
      minFitHeight,
      calculateMinLength(roomSize, connectorLength, yRoomCount, padding)
    );
  });
  return { canvasWidth: minFitWidth, canvasHeight: minFitHeight };
};

const calculateMinLength = (
  roomSize: number,
  connectorLength: number,
  roomCount: number,
  padding: number
) => {
  return roomCount * roomSize + (roomCount - 1) * connectorLength + 2 * padding;
};
