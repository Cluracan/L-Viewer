import { roomData, type RoomId } from "../../../assets/data/roomData";
import type { GridDirection, GridPosition, RawRoomGrid } from "./types";

interface StackData {
  roomId: RoomId;
  position: GridPosition;
  exits: Set<GridDirection>;
}

const isCompassDirection = (direction: string): direction is GridDirection => {
  return direction in gridDirectionOffsets;
};

export const gridDirectionOffsets = {
  n: { dx: 0, dy: -1 },
  e: { dx: 1, dy: 0 },
  s: { dx: 0, dy: 1 },
  w: { dx: -1, dy: 0 },
  ne: { dx: 1, dy: -1 },
  se: { dx: 1, dy: 1 },
  sw: { dx: -1, dy: 1 },
  nw: { dx: -1, dy: -1 },
} as const;

const getNextRoomOffset = (
  { x, y }: GridPosition,
  direction: GridDirection
): GridPosition => {
  const { dx, dy } = gridDirectionOffsets[direction];
  return { x: x + dx, y: y + dy };
};

export const buildRoomGrid = (initialRoom: RoomId) => {
  const roomGridMap: RawRoomGrid = new Map();
  const stack: StackData[] = [
    { roomId: initialRoom, position: { x: 0, y: 0 }, exits: new Set() },
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
            currentRoom.position,
            direction
          );
          stack.push({
            roomId: nextRoomId,
            position: nextRoomLocation,
            exits: new Set(),
          });
        }
      }
      roomGridMap.set(currentRoom.roomId, {
        position: currentRoom.position,
        exits: currentRoom.exits,
      });
    }
  }
  return roomGridMap;
};
