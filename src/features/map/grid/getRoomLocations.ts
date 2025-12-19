import { levelsConfig } from "../levelsConfig";
import { buildRoomGrid } from "./buildRoomGrid";
import { normaliseGrid } from "./normaliseGrid";

export const getRoomLocations = () => {
  return levelsConfig.map(({ level, initialRoom }) => {
    const raw = buildRoomGrid(initialRoom);
    const { height, width, grid } = normaliseGrid(raw);
    return { level, grid, height, width };
  });
};
