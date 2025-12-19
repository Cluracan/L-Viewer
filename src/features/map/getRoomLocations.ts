import { roomData, type RoomId } from "../../assets/data/roomData";
import { levelsConfig } from "./levelsConfig";

//types
type GridPosition = { x: number; y: number };
interface OffsetData {
  roomId: RoomId;
  gridPosition: GridPosition;
  exits: Set<CompassDirection>;
}
type RoomGridMap = Map<
  RoomId,
  { gridPosition: GridPosition; exits: Set<CompassDirection> }
>;

type GridBounds = {
  height: number;
  width: number;
  grid: RoomGridMap;
};

//helper functions

const nextRoomOffsets = {
  n: { dx: 0, dy: -1 },
  e: { dx: 1, dy: 0 },
  s: { dx: 0, dy: 1 },
  w: { dx: -1, dy: 0 },
  ne: { dx: 1, dy: -1 },
  se: { dx: 1, dy: 1 },
  sw: { dx: -1, dy: 1 },
  nw: { dx: -1, dy: -1 },
} as const satisfies Record<string, { dx: number; dy: number }>;

type CompassDirection = keyof typeof nextRoomOffsets;
const isCompassDirection = (
  direction: string
): direction is keyof typeof nextRoomOffsets => {
  return direction in nextRoomOffsets;
};

const getNextRoomOffset = (
  { x, y }: GridPosition,
  direction: CompassDirection
): GridPosition => {
  const { dx, dy } = nextRoomOffsets[direction];
  return { x: x + dx, y: y + dy };
};

const buildRoomGrid = (initialRoom: RoomId) => {
  const roomGridMap: RoomGridMap = new Map();
  const stack: OffsetData[] = [
    { roomId: initialRoom, gridPosition: { x: 0, y: 0 }, exits: new Set() },
  ];
  while (stack.length > 0) {
    const currentRoom = stack.pop();
    if (!currentRoom) {
      throw new Error("Unexpected empty stack in getRoomLocations");
    }
    if (!roomGridMap.has(currentRoom.roomId)) {
      const exitData = roomData[currentRoom.roomId].exits;
      for (const [direction, nextRoomId] of Object.entries(exitData)) {
        if (isCompassDirection(direction) && !roomGridMap.has(nextRoomId)) {
          currentRoom.exits.add(direction);
          const nextRoomLocation = getNextRoomOffset(
            currentRoom.gridPosition,
            direction
          );
          stack.push({
            roomId: nextRoomId,
            gridPosition: nextRoomLocation,
            exits: new Set(),
          });
        }
      }
      roomGridMap.set(currentRoom.roomId, {
        gridPosition: currentRoom.gridPosition,
        exits: currentRoom.exits,
      });
    }
  }
  return roomGridMap;
};

const normaliseGrid = (roomGridMap: RoomGridMap): GridBounds => {
  let [minX, maxX, minY, maxY] = [0, 0, 0, 0];
  for (const { gridPosition } of roomGridMap.values()) {
    minX = Math.min(minX, gridPosition.x);
    maxX = Math.max(maxX, gridPosition.x);
    minY = Math.min(minY, gridPosition.y);
    maxY = Math.max(maxY, gridPosition.y);
  }
  const shiftX = -minX;
  const shiftY = -minY;
  const height = maxY - minY + 1;
  const width = maxX - minX + 1;
  const normalisedGrid: RoomGridMap = new Map();
  for (const [
    roomId,
    { gridPosition: gridPosition, exits },
  ] of roomGridMap.entries()) {
    normalisedGrid.set(roomId, {
      gridPosition: { x: gridPosition.x + shiftX, y: gridPosition.y + shiftY },
      exits,
    });
  }
  return { height, width, grid: normalisedGrid };
};

export const getRoomLocations = () => {
  return levelsConfig.map(({ level, initialRoom }) => {
    const roomGridMap = buildRoomGrid(initialRoom);
    const { height, width, grid } = normaliseGrid(roomGridMap);
    return { level, roomGridMap, grid, height, width };
  });
};
