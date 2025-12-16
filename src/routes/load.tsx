import { createFileRoute } from "@tanstack/react-router";
import { LoadContent } from "../features/load/LoadContent";

export const Route = createFileRoute("/load")({
  component: Load,
});

function Load() {
  return (
    <>
      <LoadContent />
    </>
  );
}
