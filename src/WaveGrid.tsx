import { useCallback, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { v4 as uuid } from "uuid";

interface Wave {
  id: string;
  equation: string;
}

const EXAMPLE_EQUATIONS = [
  "Math.sin(x/16)",
  "-y",
  "Math.tanh(y * 2)",
  "y * 1.5",
];

const drawPoints = (ctx: CanvasRenderingContext2D, points: Array<Point>) => {
  ctx.translate(0.5, 0.5);
  ctx.strokeStyle = "#00ffc3";
  ctx.moveTo(points[0].x, points[0].y);
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
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
  index: number;
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
      <WaveCanvas id={id} equation={equation} points={points} error={null} />
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
  error: string | null;
}

export default function WaveGrid() {
  const [waves, setWaves] = useState<Wave[]>([
    { id: uuid(), equation: EXAMPLE_EQUATIONS[0] },
  ]);

  const addNewWave = () =>
    setWaves((w) => {
      let equation = "y";
      if (w.length < EXAMPLE_EQUATIONS.length) {
        equation = EXAMPLE_EQUATIONS[w.length];
      }
      EXAMPLE_EQUATIONS[w.length];
      return [...w, { id: uuid(), equation: equation }];
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
    processed_waves.push(
      process_wave(waves[i], i > 0 ? processed_waves[i - 1].points : null)
    );
  }

  const renderWaveGridItem = useCallback(
    (wave: ProcessedWave, index: number) => {
      return (
        <WaveGridItem
          index={index}
          key={`${wave.id}-${index}`}
          {...wave}
          onChange={(value) => {
            setEquation(wave.id, value);
          }}
        />
      );
    },
    []
  );

  return (
    <div
      css={css`
        display: flex;
        gap: 10px;
        padding: 10px;
        background: #303037;
        border-radius: 10px;
        align-items: center;
      `}
    >
      {processed_waves.map((wave, index) => renderWaveGridItem(wave, index))}
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

function process_wave(wave: Wave, previous_points: Array<Point> | null) {
  // calculate the points and add an error (if appropriate).
  const parsed_equation = (x: number, y: number) => {
    try {
      return eval(wave.equation);
    } catch (e: unknown) {
      console.log(e);
      console.log((e as Error).toString());
      return 0;
    }
  };
  let points: Array<Point>;
  if (!previous_points) {
    points = Array.from(Array(300).keys()).map((x) => ({
      x,
      y: parsed_equation(x, 0),
    }));
  } else {
    points = previous_points.map((point) => ({
      x: point.x,
      y: parsed_equation(point.x, point.y),
    }));
  }

  return {
    id: wave.id,
    equation: wave.equation,
    points: points,
    error: null,
  };
}
