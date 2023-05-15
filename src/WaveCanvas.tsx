import { css } from "@emotion/react";
import { useEffect, useRef } from "react";
import type { Point, ProcessedWave } from "./WaveGridItem";

const drawPoints = (ctx: CanvasRenderingContext2D, points: Array<Point>) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.strokeStyle = "#00ffc3";
  ctx.moveTo(points[0].x, points[0].y);
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y * 50 + 100);
  }
  ctx.stroke();
};

export default function WaveCanvas({ points }: ProcessedWave) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 300, 200);
    drawPoints(ctx, points);
  }, [points]);

  return (
    <div
      css={css`
        background: #53535e;
        border-radius: 10px;
      `}
    >
      <canvas
        css={css`
          display: block;
        `}
        ref={canvasRef}
        width={300}
        height={200}
      />
    </div>
  );
}
