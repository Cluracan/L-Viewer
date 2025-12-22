import { useEffect, useRef } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { Mapper } from "./render/Mapper";
import { getNormalisedRoomGrids } from "./grid/getNormalisedRoomGrids";
import { buildDrawableRooms } from "./render/buildDrawableRooms";
import type { DrawableRoomLevel } from "./render/types";
import type { RoomId } from "../../assets/data/roomData";

export type PlayerMapData = {
  color: string;
  playerName: string;
  currentRoom: RoomId;
};
type CanvasProps = { levelIndex: number; players: PlayerMapData[] };

const CANVAS_RATIO = 0.6;
const ROOM_SIZE = 60;
const CONNECTOR_LENGTH = 6;

export const Canvas = ({ levelIndex, players }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const mapperRef = useRef<Mapper | null>(null);

  const drawableLevelsRef = useRef<DrawableRoomLevel[]>([]);
  const { width, height } = useWindowDimensions();
  const canvasWidth = CANVAS_RATIO * width;
  const canvasHeight = CANVAS_RATIO * height;
  useEffect(() => {
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
    if (!contextRef.current) return;
    mapperRef.current = new Mapper(contextRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      roomSize: ROOM_SIZE,
      connectorLength: CONNECTOR_LENGTH,
      roomCornerRadius: 3,
    });
    const normalisedLevels = getNormalisedRoomGrids();

    const drawableLevels = buildDrawableRooms(
      normalisedLevels,
      canvasWidth,
      canvasHeight,
      ROOM_SIZE,
      CONNECTOR_LENGTH
    );
    drawableLevelsRef.current = drawableLevels;
    mapperRef.current.renderMap(
      drawableLevels[0].rooms,
      ROOM_SIZE,
      CONNECTOR_LENGTH,
      players
    );
  }, [canvasWidth, canvasHeight, players]);

  useEffect(() => {
    if (!mapperRef.current) return;
    if (!drawableLevelsRef.current) return;

    mapperRef.current.clearCanvas();
    mapperRef.current.renderMap(
      drawableLevelsRef.current[levelIndex].rooms,
      ROOM_SIZE,
      CONNECTOR_LENGTH,
      players
    );
  }, [levelIndex, players]);
  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        role="img"
        aria-label="A map of the gameworld showing player locations."
      />
    </>
  );
};
