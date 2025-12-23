import type { NormalisedGridLevel } from "../grid/types";

export const minimiseCanvas = (
  roomSize: number,
  connectorLength: number,
  padding: number,
  normalisedLevels: NormalisedGridLevel[],
  maxWidth: number,
  maxHeight: number
) => {
  // Smallest canvas given fixed roomsize
  let minViableWidth = 0;
  let minViableHeight = 0;
  normalisedLevels.forEach((level) => {
    const xRoomCount = level.normalised.width;
    const yRoomCount = level.normalised.height;
    minViableWidth = Math.max(
      minViableWidth,
      calculateCanvasLength(roomSize, connectorLength, xRoomCount, padding)
    );
    minViableHeight = Math.max(
      minViableHeight,
      calculateCanvasLength(roomSize, connectorLength, yRoomCount, padding)
    );
  });
  if (minViableWidth < maxWidth && minViableHeight < maxHeight) {
    return {
      canvasWidth: minViableWidth,
      canvasHeight: minViableHeight,
      roomSize,
      connectorLength,
    };
  } else {
    // Largest roomsize given fixed width
    let maxViableRoomSize = roomSize;
    const connectorRatio = connectorLength / roomSize;
    normalisedLevels.forEach((level) => {
      const xRoomCount = level.normalised.width;
      const yRoomCount = level.normalised.height;
      maxViableRoomSize = Math.min(
        maxViableRoomSize,
        calculateRoomSize(maxWidth, xRoomCount, connectorRatio, padding)
      );
      maxViableRoomSize = Math.min(
        maxViableRoomSize,
        calculateRoomSize(maxHeight, yRoomCount, connectorRatio, padding)
      );
    });
    maxViableRoomSize = Math.floor(maxViableRoomSize);
    const maxViableConnectorLength = maxViableRoomSize * connectorRatio;
    return {
      canvasWidth: maxWidth,
      canvasHeight: maxHeight,
      roomSize: maxViableRoomSize,
      connectorLength: maxViableConnectorLength,
    };
  }
};

const calculateCanvasLength = (
  roomSize: number,
  connectorLength: number,
  roomCount: number,
  padding: number
) => {
  return roomCount * roomSize + (roomCount - 1) * connectorLength + 2 * padding;
};

const calculateRoomSize = (
  canvasLength: number,
  roomCount: number,
  connectorRatio: number,
  padding: number
) => {
  return (
    (canvasLength - 2 * padding) /
    (roomCount + (roomCount - 1) * connectorRatio)
  );
};
