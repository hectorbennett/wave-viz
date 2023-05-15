import { css } from "@emotion/react";
import WaveCanvas from "./WaveCanvas";

export interface Wave {
  id: string;
  equation: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface ProcessedWave extends Wave {
  points: Array<Point>;
  error: string | null;
}

export interface WaveGridItemProps extends ProcessedWave {
  onChange: (value: string) => void;
  index: number;
}

export default function WaveGridItem({
  id,
  equation,
  points,
  onChange,
}: WaveGridItemProps) {
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
