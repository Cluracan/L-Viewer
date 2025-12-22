import { roomData, type RoomId } from "../../assets/data/roomData";

type LevelConfig = {
  level: string;
  initialRoom: RoomId;
};

export const levelsConfig: LevelConfig[] = [
  { level: "Ground floor", initialRoom: roomData.hallway.id },
  { level: "First floor", initialRoom: roomData.stairsSpiral.id },
  { level: "Cellars", initialRoom: roomData.cellar00.id },
  { level: "Attic", initialRoom: roomData.attic.id },
];
