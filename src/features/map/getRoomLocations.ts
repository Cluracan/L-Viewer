import { roomData, type RoomId } from "../../assets/data/roomData";
import { levelsConfig } from "./levelsConfig";

//types
type Location = { x: number; y: number };
interface OffsetData {
  roomId: RoomId;
  location: Location;
  exits: Set<CompassDirection>;
}
type OffsetMap = Map<
  RoomId,
  { location: Location; exits: Set<CompassDirection> }
>;
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
  { x, y }: Location,
  direction: CompassDirection
): Location => {
  const { dx, dy } = nextRoomOffsets[direction];
  return { x: x + dx, y: y + dy };
};

const getOffsetMap = (initialRoom: RoomId) => {
  const offsetMap: OffsetMap = new Map();
  const stack: OffsetData[] = [
    { roomId: initialRoom, location: { x: 0, y: 0 }, exits: new Set() },
  ];
  while (stack.length > 0) {
    const currentRoom = stack.pop();
    if (!currentRoom) {
      throw new Error("Unexpected empty stack in getRoomLocations");
    }
    if (!offsetMap.has(currentRoom.roomId)) {
      const exitData = roomData[currentRoom.roomId].exits;
      for (const [direction, nextRoomId] of Object.entries(exitData)) {
        if (isCompassDirection(direction) && !offsetMap.has(nextRoomId)) {
          currentRoom.exits.add(direction);
          const nextRoomLocation = getNextRoomOffset(
            currentRoom.location,
            direction
          );
          stack.push({
            roomId: nextRoomId,
            location: nextRoomLocation,
            exits: new Set(),
          });
        }
      }
      offsetMap.set(currentRoom.roomId, {
        location: currentRoom.location,
        exits: currentRoom.exits,
      });
    }
  }
  return offsetMap;
};

const translateOffsetMap = (offsetMap: OffsetMap) => {
  let [minX, maxX, minY, maxY] = [0, 0, 0, 0];
  for (const { location } of offsetMap.values()) {
    minX = Math.min(minX, location.x);
    maxX = Math.max(maxX, location.x);
    minY = Math.min(minY, location.y);
    maxY = Math.max(maxY, location.y);
  }
  const dx = Math.abs(minX);
  const dy = Math.abs(minY);
  const height = maxY - minY + 1;
  const width = maxX - minX + 1;
  const translatedOffsetMap: OffsetMap = new Map();
  for (const [roomId, { location, exits }] of offsetMap.entries()) {
    translatedOffsetMap.set(roomId, {
      location: { x: location.x + dx, y: location.y + dy },
      exits,
    });
  }
  return { height, width, translatedOffsetMap };
};

export const getRoomLocations = () => {
  return levelsConfig.map(({ level, initialRoom }) => {
    const offsetMap = getOffsetMap(initialRoom);
    const { height, width, translatedOffsetMap } =
      translateOffsetMap(offsetMap);
    return { level, offsetMap, translatedOffsetMap, height, width };
  });
};
