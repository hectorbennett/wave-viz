import type { Meta, StoryObj } from "@storybook/react";
import WaveGrid from "../WaveGrid";

const meta = {
  component: WaveGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof WaveGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {},
};
