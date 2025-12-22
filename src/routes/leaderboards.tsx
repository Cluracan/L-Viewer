import { createFileRoute } from "@tanstack/react-router";
import { LeaderboardsContent } from "../features/leaderboards/LeaderboardsContent";

export const Route = createFileRoute("/leaderboards")({
  component: Leaderboards,
});

function Leaderboards() {
  return (
    <>
      <LeaderboardsContent />
    </>
  );
}
