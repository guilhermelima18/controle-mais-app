import React from "react";
import { Group, Text, type SkFont } from "@shopify/react-native-skia";
import type { PieSliceData } from "victory-native";
import { formatCurrency } from "@/helpers/masks";

export const PieChartCustomLabel = ({
  slice,
  font,
  position,
}: {
  slice: PieSliceData;
  font: SkFont | null;
  position: { x: number; y: number };
}) => {
  const { x, y } = position;
  const fontSize = font?.getSize() ?? 0;
  const getLabelWidth = (text: string) =>
    font
      ?.getGlyphWidths(font.getGlyphIDs(text))
      .reduce((sum, value) => sum + value, 0) ?? 0;

  const label = slice.label;
  const value = formatCurrency(Math.round(slice.value * 100).toString());
  const centerLabel = (font?.getSize() ?? 0) / 2;

  return (
    <Group transform={[{ translateY: -centerLabel }]}>
      <Text
        x={x - getLabelWidth(label) / 2}
        y={y}
        text={label}
        font={font}
        color={"white"}
      />
      <Group>
        <Text
          x={x - getLabelWidth(value) / 2}
          y={y + fontSize}
          text={value}
          font={font}
          color="#FFF"
        />
      </Group>
    </Group>
  );
};
