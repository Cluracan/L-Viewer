import { useSaveFileStore } from "../../store/useSaveFileStore";

export const LeaderboardsContent = () => {
  const playerFiles = useSaveFileStore((state) => state.fileStore);
  return <>{JSON.stringify(playerFiles)}</>;
};
