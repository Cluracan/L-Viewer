import type { RoomId } from "../../assets/data/roomData";

type LevelConfig = {
  level: string;
  initialRoom: RoomId;
};

export const levelsConfig: LevelConfig[] = [
  { level: "Ground floor", initialRoom: "hallway" },
  { level: "First floor", initialRoom: "stairsSpiral" },
  { level: "Cellars", initialRoom: "cellar00" },
  { level: "Attic", initialRoom: "attic" },
];
