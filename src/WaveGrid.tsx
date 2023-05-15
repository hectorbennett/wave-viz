import { useCallback, useState } from "react";
import { css } from "@emotion/react";
import { v4 as uuid } from "uuid";
import { evaluate } from "mathjs/number";
import type { Point, ProcessedWave, Wave } from "./WaveGridItem";
import WaveGridItem from "./WaveGridItem";
// import { merge_equations } from "./merge_equations";

const EXAMPLE_EQUATIONS = [
  "sin(x / 16)",
  "-y",
  "tanh(y * 2)",
  "y - cos(x / 3) / 5",
];

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
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 2rem;
        width: 100%;
        height: 100%;
        overflow: auto;
      `}
    >
      <div
        css={css`
          display: flex;
          gap: 10px;
          padding: 10px;
          background: #303037;
          border-radius: 10px;
          align-items: center;
          // margin: 2rem 10rem;
        `}
      >
        {processed_waves.map((wave, index) => renderWaveGridItem(wave, index))}
        <AddNewWave onClick={addNewWave} />
      </div>
      {/* <div
        css={css`
          // position: fixed;
          width: 100%;
          display: flex;
          justify-content: center;
        `}
      >
        <div
          css={css`
            background: #303037;
            padding: 1rem;
            border-radius: 1rem;
            position: fixed;
          `}
        >
          {merge_equations(waves.map((wave) => wave.equation))}
        </div>
      </div> */}
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
      return evaluate(wave.equation, { x, y });
    } catch {
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
