import { css } from "@emotion/react";
// import Wave from "./Wave";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

interface Wave {
  id: string;
  equation: string;
}

const drawPoints = (ctx: CanvasRenderingContext2D, points: Array<Point>) => {
  console.log(points);
  ctx.moveTo(points[0].x, points[0].y);
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    console.log(points[i].x, points[i].y);
    ctx.lineTo(points[i].x, points[i].y * 50 + 100);
  }
  ctx.stroke();
};

function WaveCanvas({ points }: ProcessedWave) {
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

interface WaveGridItemProps extends ProcessedWave {
  onChange: (value: string) => void;
}

function WaveGridItem({ id, equation, points, onChange }: WaveGridItemProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 10px;
      `}
    >
      <WaveCanvas id={id} equation={equation} points={points} />
      <input
        type="text"
        value={equation}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface Point {
  x: number;
  y: number;
}
interface ProcessedWave extends Wave {
  points: Array<Point>;
}

export default function WaveGrid() {
  const [waves, setWaves] = useState<Wave[]>([
    { id: uuid(), equation: "Math.sin(x/16)" },
  ]);

  const addNewWave = () =>
    setWaves((w) => {
      return [...w, { id: uuid(), equation: "-y" }];
    });

  const setEquation = (id: string, value: string) => {
    setWaves((w) => {
      return w.map((wave) => {
        if (wave.id === id) {
          return { ...wave, equation: value };
        }
        return wave;
      });
    });
  };

  const processed_waves: ProcessedWave[] = [];
  for (let i = 0; i < waves.length; i++) {
    const parsed_equation = (x: number, y: number) => {
      try {
        return eval(waves[i].equation);
      } catch (e) {
        console.log(e);
        return 0;
      }
    };
    let points: Array<Point>;
    if (i == 0) {
      points = Array.from(Array(300).keys()).map((x) => ({
        x,
        y: parsed_equation(x, 0),
      }));
    } else {
      points = processed_waves[i - 1].points.map((point) => ({
        x: point.x,
        y: parsed_equation(point.x, point.y),
      }));
    }
    processed_waves.push({
      id: waves[i].id,
      equation: waves[i].equation,
      points: points,
    });
  }

  return (
    <div
      css={css`
        display: flex;
        gap: 10px;
        padding: 10px;
        background: #262626;
        border-radius: 10px;
        align-items: center;
      `}
    >
      {processed_waves.map((wave) => (
        <WaveGridItem
          {...wave}
          onChange={(value) => {
            setEquation(wave.id, value);
          }}
        />
      ))}

      <AddNewWave onClick={addNewWave} />
    </div>
  );
}

function AddNewWave({ onClick }: { onClick: () => void }) {
  return (
    <div
      css={css`
        border: 1px solid black;
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      `}
      onClick={onClick}
    >
      +
    </div>
  );
}
