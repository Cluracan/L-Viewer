import type { PlayerMapData } from "../Canvas";
import { gridDirectionOffsets } from "../grid/buildRoomGrid";
import type { GridDirection } from "../grid/types";
import type { DrawableRoomMap, MapRendererConfig } from "./types";

// Helpers
const diceSpotDisplacements = [
  [],
  [{ dx: 0.5, dy: 0.5 }],
  [
    { dx: 0.25, dy: 0.25 },
    { dx: 0.75, dy: 0.75 },
  ],
  [
    { dx: 0.25, dy: 0.25 },
    { dx: 0.5, dy: 0.5 },
    { dx: 0.75, dy: 0.75 },
  ],
  [
    { dx: 0.25, dy: 0.25 },
    { dx: 0.75, dy: 0.75 },
    { dx: 0.25, dy: 0.75 },
    { dx: 0.75, dy: 0.25 },
  ],
  [
    { dx: 0.25, dy: 0.25 },
    { dx: 0.75, dy: 0.75 },
    { dx: 0.5, dy: 0.5 },
    { dx: 0.25, dy: 0.75 },
    { dx: 0.75, dy: 0.25 },
  ],
  [
    { dx: 0.25, dy: 0.25 },
    { dx: 0.75, dy: 0.25 },
    { dx: 0.25, dy: 0.5 },
    { dx: 0.75, dy: 0.5 },
    { dx: 0.25, dy: 0.75 },
    { dx: 0.75, dy: 0.75 },
  ],
];

const getExitPosition = (
  x: number,
  y: number,
  exitDirection: GridDirection,
  roomSize: number,
  connectorLength: number
) => {
  const startFromExit: Record<GridDirection, { x: number; y: number }> = {
    n: { x: x + roomSize / 2, y },
    s: { x: x + roomSize / 2, y: y + roomSize },
    e: { x: x + roomSize, y: y + roomSize / 2 },
    w: { x, y: y + roomSize / 2 },
    ne: { x: x + roomSize, y },
    se: { x: x + roomSize, y: y + roomSize },
    sw: { x: x, y: y + roomSize },
    nw: { x, y },
  };
  const start = startFromExit[exitDirection];
  const { dx, dy } = scaledOffset(exitDirection, connectorLength);
  return { start, end: { x: start.x + dx, y: start.y + dy } };
};

const scaledOffset = (direction: GridDirection, factor: number) => {
  const { dx, dy } = gridDirectionOffsets[direction];
  return {
    dx: dx * factor,
    dy: dy * factor,
  };
};

export class Mapper {
  private ctx: CanvasRenderingContext2D;
  private config: MapRendererConfig;

  constructor(ctx: CanvasRenderingContext2D, config: MapRendererConfig) {
    this.ctx = ctx;
    this.config = config;
  }
  clearCanvas() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.config.width, this.config.height);
  }
  renderMap(
    drawableRooms: DrawableRoomMap,
    roomSize: number,
    connectorLength: number,
    players: PlayerMapData[]
  ) {
    this.clearCanvas();
    Object.entries(drawableRooms).forEach(([roomId, { x, y, exits }]) => {
      this.renderRoom(x, y, roomSize);
      this.renderExits(x, y, exits, roomSize, connectorLength);
      const playersPresent = players.filter(
        (player) => player.currentRoom === roomId
      );
      if (playersPresent.length > 0) {
        this.renderPlayer(x, y, playersPresent);
      }
    });
  }
  renderRoom(x: number, y: number, roomSize: number) {
    this.ctx.fillStyle = "black";
    this.ctx.strokeStyle = "black";
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, roomSize, roomSize, 3);
    this.ctx.stroke();
  }
  renderExits(
    x: number,
    y: number,
    exits: Set<GridDirection>,
    roomSize: number,
    connectorLength: number
  ) {
    for (const exitDirection of exits) {
      const { start, end } = getExitPosition(
        x,
        y,
        exitDirection,
        roomSize,
        connectorLength
      );
      this.ctx.strokeStyle = "black";
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.stroke();
    }
  }
  renderPlayer(x: number, y: number, players: PlayerMapData[]) {
    const playerCount = players.length;
    if (playerCount === 0) return;
    if (playerCount <= 6) {
      const displacements = diceSpotDisplacements[playerCount];
      for (let i = 0; i < playerCount; i++) {
        const { dx, dy } = displacements[i];
        this.ctx.strokeStyle = players[i].color;
        this.ctx.fillStyle = players[i].color;
        this.ctx.beginPath();
        this.ctx.arc(
          x + this.config.roomSize * dx,
          y + this.config.roomSize * dy,
          this.config.roomSize * 0.1,
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
        this.ctx.fill();
      }
    } else {
      const sectorAngle = (2 * Math.PI) / playerCount;
      for (let i = 0; i < playerCount; i++) {
        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = players[i].color;
        this.ctx.beginPath();
        this.ctx.arc(
          x + this.config.roomSize / 2,
          y + this.config.roomSize / 2,
          this.config.roomSize * 0.4,
          i * sectorAngle,
          (i + 1) * sectorAngle
        );
        this.ctx.lineTo(
          x + this.config.roomSize / 2,
          y + this.config.roomSize / 2
        );
        this.ctx.stroke();
        this.ctx.fill();
      }
    }
  }
}
