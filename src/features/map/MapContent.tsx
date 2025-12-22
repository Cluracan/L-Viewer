import { levelsConfig } from "./levelsConfig";

import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { Canvas } from "./Canvas";
import { useState } from "react";
// import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { getNormalisedRoomGrids } from "./grid/getNormalisedRoomGrids";

import { useSaveFileStore } from "../../store/useSaveFileStore";
import type { RoomId } from "../../assets/data/roomData";

const uuidToColor = (uuid: string) => {
  const hexDigits = uuid.replaceAll("-", "").slice(0, 6);
  return `#${hexDigits}`;
};

export const MapContent = () => {
  const [levelIndex, setLevelIndex] = useState(0);

  // const { width, height } = useWindowDimensions();

  const playerFiles = useSaveFileStore((state) => state.fileStore);
  const mapLevels = getNormalisedRoomGrids();
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
    <>
      <Canvas levelIndex={levelIndex} players={selectedPlayerMapData} />
      <List
        sx={{ height: "60vh", overflow: "auto" }}
        subheader={<ListSubheader>{mapLevels[levelIndex].level}</ListSubheader>}
      >
        {selectedPlayers.map(([id, save]) => {
          return (
            <ListItem key={id}>
              <ListItemIcon>
                <CircleIcon sx={{ color: uuidToColor(id) }} />
              </ListItemIcon>
              <ListItemText primary={save.playerName} />
            </ListItem>
          );
        })}
      </List>
      <Button onClick={handleIncreaseLevel}>+</Button>
      <Button onClick={handleDecreaseLevel}>-</Button>
    </>
  );
};
