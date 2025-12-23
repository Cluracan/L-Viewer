import { useEffect, useMemo, useRef } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { Mapper } from "./render/Mapper";
import { getNormalisedRoomGrids } from "./grid/getNormalisedRoomGrids";
import { buildDrawableRooms } from "./render/buildDrawableRooms";
import type { DrawableRoomLevel } from "./render/types";
import type { RoomId } from "../../assets/data/roomData";
import { minimiseCanvas } from "./render/minimiseCanvas";

export type PlayerMapData = {
  color: string;
  playerName: string;
  currentRoom: RoomId;
};
type CanvasProps = { levelIndex: number; players: PlayerMapData[] };

const CANVAS_RATIO = 0.6;
const DEFAULT_ROOM_SIZE = 60;
const DEFAULT_CONNECTOR_LENGTH = 6;
const CANVAS_PADDING = 60;
const ROOM_RADUIS = 3;

export const Canvas = ({ levelIndex, players }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const mapperRef = useRef<Mapper | null>(null);

  const drawableLevelsRef = useRef<DrawableRoomLevel[]>([]);
  const { width, height } = useWindowDimensions();
  const maxCanvasWidth = CANVAS_RATIO * width;
  const maxCanvasHeight = CANVAS_RATIO * height;
  const normalisedLevels = useMemo(() => getNormalisedRoomGrids(), []);

  const { canvasWidth, canvasHeight, roomSize, connectorLength } = useMemo(
    () =>
      minimiseCanvas(
        DEFAULT_ROOM_SIZE,
        DEFAULT_CONNECTOR_LENGTH,
        CANVAS_PADDING,
        normalisedLevels,
        maxCanvasWidth,
        maxCanvasHeight
      ),
    [normalisedLevels, maxCanvasWidth, maxCanvasHeight]
  );

  useEffect(() => {
    console.log({ roomSize });
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
    if (!contextRef.current) return;

    mapperRef.current = new Mapper(contextRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      roomSize: roomSize,
      connectorLength: connectorLength,
      roomCornerRadius: ROOM_RADUIS,
    });

    const drawableLevels = buildDrawableRooms(
      normalisedLevels,
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
    normalisedLevels,
    players,
    connectorLength,
    roomSize,
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
