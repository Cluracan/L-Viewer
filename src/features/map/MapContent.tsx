import { levelsConfig } from "./levelsConfig";
import { Canvas } from "./Canvas";
import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { getNormalisedRoomGrids } from "./grid/getNormalisedRoomGrids";
import { useSaveFileStore } from "../../store/useSaveFileStore";
import { PlayerList } from "./playerList";
import { Stack } from "@mui/material";
import { minimiseCanvas } from "./render/minimiseCanvas";
import type { RoomId } from "../../assets/data/roomData";

// Helpers
const uuidToColor = (uuid: string) => {
  const hexDigits = uuid.replaceAll("-", "").slice(0, 6);
  return `#${hexDigits}`;
};

// Constants
const CANVAS_RATIO = 0.6;
const DEFAULT_ROOM_SIZE = 60;
const DEFAULT_CONNECTOR_LENGTH = 6;
const CANVAS_PADDING = 60;
const ROOM_RADIUS = 3;

export const MapContent = () => {
  const [levelIndex, setLevelIndex] = useState(0);

  const playerFiles = useSaveFileStore((state) => state.fileStore);
  const { width, height } = useWindowDimensions();
  const maxCanvasWidth = CANVAS_RATIO * width;
  const maxCanvasHeight = CANVAS_RATIO * height;

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

  const canvasSize = useMemo(
    () =>
      minimiseCanvas(
        DEFAULT_ROOM_SIZE,
        DEFAULT_CONNECTOR_LENGTH,
        CANVAS_PADDING,
        mapLevels,
        maxCanvasWidth,
        maxCanvasHeight
      ),
    [mapLevels, maxCanvasWidth, maxCanvasHeight]
  );

  // Handlers
  const handleIncreaseLevel = () => {
    setLevelIndex((levelIndex) => (levelIndex + 1) % levelsConfig.length);
  };

  const handleDecreaseLevel = () => {
    setLevelIndex(
      (levelIndex) =>
        (levelIndex + levelsConfig.length - 1) % levelsConfig.length
    );
  };

  // Effects
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        handleDecreaseLevel();
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        handleIncreaseLevel();
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <Stack direction={"row"} gap={2}>
      <Canvas
        levelIndex={levelIndex}
        players={selectedPlayerMapData}
        mapLevels={mapLevels}
        canvasDimensions={{ ...canvasSize, roomRadius: ROOM_RADIUS }}
      />
      <PlayerList
        selectedPlayers={selectedPlayers}
        level={mapLevels[levelIndex].level}
        handleIncreaseLevel={handleIncreaseLevel}
        handleDecreaseLevel={handleDecreaseLevel}
        height={canvasSize.canvasHeight}
      />
    </Stack>
  );
};
