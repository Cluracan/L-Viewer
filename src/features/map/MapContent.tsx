import { useEffect, useRef } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { Mapper } from "./Mapper";
import { getRoomLocations } from "./grid/getRoomLocations";

const CANVAS_RATIO = 0.5;

export const MapContent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const mapperRef = useRef<Mapper | null>(null);
  const { width, height } = useWindowDimensions();
  const canvasWidth = CANVAS_RATIO * width;
  const canvasHeight = CANVAS_RATIO * height;
  useEffect(() => {
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
    if (!contextRef.current) return;
    mapperRef.current = new Mapper(
      contextRef.current,
      canvasWidth,
      canvasHeight
    );
    getRoomLocations().forEach((item) => console.log(item));
  }, [canvasWidth, canvasHeight]);

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
