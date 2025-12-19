import { createFileRoute } from "@tanstack/react-router";
import { MapContent } from "../features/map/MapContent";

export const Route = createFileRoute("/map")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <MapContent />
    </>
  );
}
