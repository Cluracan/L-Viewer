import { levelsConfig } from "../levelsConfig";
import { buildRoomGrid } from "./buildRoomGrid";
import { normaliseGrid } from "./normaliseGrid";
import type { NormalisedGridLevel } from "./types";

export const getNormalisedRoomGrids = (): NormalisedGridLevel[] => {
  return levelsConfig.map(({ level, initialRoom }) => {
    const raw = buildRoomGrid(initialRoom);
    const normalised = normaliseGrid(raw);
    return { level, normalised };
  });
};
