import { css } from "@emotion/react";

export default function Wave() {
  return (
    <div
      css={css`
        border: 1px solid black;
        width: 100px;
        height: 100px;
      `}
    >
      I am a wave
    </div>
  );
}
