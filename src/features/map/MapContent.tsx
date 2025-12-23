import { levelsConfig } from "./levelsConfig";

import { Canvas } from "./Canvas";
import { useMemo, useState } from "react";
// import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { getNormalisedRoomGrids } from "./grid/getNormalisedRoomGrids";

import { useSaveFileStore } from "../../store/useSaveFileStore";
import type { RoomId } from "../../assets/data/roomData";
import { PlayerList } from "./playerList";
import { Stack } from "@mui/material";

const uuidToColor = (uuid: string) => {
  const hexDigits = uuid.replaceAll("-", "").slice(0, 6);
  return `#${hexDigits}`;
};

export const MapContent = () => {
  const [levelIndex, setLevelIndex] = useState(0);

  // const { width, height } = useWindowDimensions();

  const playerFiles = useSaveFileStore((state) => state.fileStore);
  const mapLevels = useMemo(() => getNormalisedRoomGrids(), []);
  const selectedPlayers = Object.entries(playerFiles).filter((e) =>
    mapLevels[levelIndex].normalised.grid.has(e[1].currentRoom as RoomId)
  );
  const selectedPlayerMapData = selectedPlayers.map(([id, save]) => {
    return {
      color: uuidToColor(id),
      playerName: save.playerName,
      currentRoom: save.currentRoom,
    };
  });
  const handleIncreaseLevel = () => {
    setLevelIndex((levelIndex) => (levelIndex + 1) % levelsConfig.length);
  };
  const handleDecreaseLevel = () => {
    setLevelIndex(
      (levelIndex) =>
        (levelIndex + levelsConfig.length - 1) % levelsConfig.length
    );
  };
  return (
    <Stack direction={"row"} gap={2}>
      <Canvas levelIndex={levelIndex} players={selectedPlayerMapData} />
      <PlayerList
        selectedPlayers={selectedPlayers}
        level={mapLevels[levelIndex].level}
        handleIncreaseLevel={handleIncreaseLevel}
        handleDecreaseLevel={handleDecreaseLevel}
      />
    </Stack>
  );
};
