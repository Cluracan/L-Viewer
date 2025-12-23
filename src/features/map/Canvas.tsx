import { useEffect, useRef } from "react";
import { Mapper } from "./render/Mapper";
import { buildDrawableRooms } from "./render/buildDrawableRooms";
import type { DrawableRoomLevel } from "./render/types";
import type { RoomId } from "../../assets/data/roomData";
import type { NormalisedGridLevel } from "./grid/types";

// Types
export type PlayerMapData = {
  color: string;
  playerName: string;
  currentRoom: RoomId;
};

type CanvasDimensions = {
  canvasWidth: number;
  canvasHeight: number;
  roomSize: number;
  connectorLength: number;
  roomRadius: number;
};

type CanvasProps = {
  levelIndex: number;
  players: PlayerMapData[];
  mapLevels: NormalisedGridLevel[];
  canvasDimensions: CanvasDimensions;
};

export const Canvas = ({
  levelIndex,
  players,
  mapLevels,
  canvasDimensions,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const mapperRef = useRef<Mapper | null>(null);

  const drawableLevelsRef = useRef<DrawableRoomLevel[]>([]);

  const { canvasWidth, canvasHeight, roomSize, connectorLength, roomRadius } =
    canvasDimensions;

  useEffect(() => {
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
    if (!contextRef.current) return;

    mapperRef.current = new Mapper(contextRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      roomSize: roomSize,
      connectorLength: connectorLength,
      roomCornerRadius: roomRadius,
    });

    const drawableLevels = buildDrawableRooms(
      mapLevels,
      canvasWidth,
      canvasHeight,
      roomSize,
      connectorLength
    );
    drawableLevelsRef.current = drawableLevels;

    mapperRef.current.renderMap(
      drawableLevels[0].rooms,
      roomSize,
      connectorLength,
      players
    );
  }, [
    canvasWidth,
    canvasHeight,
    mapLevels,
    players,
    connectorLength,
    roomSize,
    roomRadius,
  ]);

  useEffect(() => {
    if (!mapperRef.current) return;
    if (!drawableLevelsRef.current) return;

    mapperRef.current.clearCanvas();
    mapperRef.current.renderMap(
      drawableLevelsRef.current[levelIndex].rooms,
      roomSize,
      connectorLength,
      players
    );
  }, [levelIndex, players, roomSize, connectorLength]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      role="img"
      aria-label="A map of the gameworld showing player locations."
    />
  );
};
