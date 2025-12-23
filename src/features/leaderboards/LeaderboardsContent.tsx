import { Typography } from "@mui/material";
import { useSaveFileStore } from "../../store/useSaveFileStore";

export const LeaderboardsContent = () => {
  const playerFiles = useSaveFileStore((state) => state.fileStore);

  return (
    <>
      Leaderboards
      {playerFiles.map((player) => (
        <Typography>{player.save.playerName}</Typography>
      ))}
    </>
  );
};
