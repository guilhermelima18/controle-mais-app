import { Text, View } from "react-native";

import { formatCurrency } from "@/helpers/masks";

import { theme } from "@/styles/theme";

type CardSummaryProps = {
  bgColor: string;
  titleColor: string;
  valueColor: string;
  title: string;
  value: number;
  hasBorder?: boolean;
};

export function CardSummary({
  bgColor,
  titleColor,
  valueColor,
  title,
  value,
  hasBorder = true,
}: CardSummaryProps) {
  return (
    <View
      style={{
        backgroundColor: bgColor,
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
        paddingVertical: 20,
        gap: 10,
        borderRadius: 8,
        borderWidth: hasBorder ? 1 : 0,
        borderColor: hasBorder ? theme.colors.gray[500] : "transparent",
      }}
    >
      <Text style={{ fontSize: 18, color: titleColor, fontWeight: "500" }}>
        {title}
      </Text>
      <Text style={{ fontSize: 28, color: valueColor, fontWeight: "500" }}>
        {formatCurrency(Math.round(value * 100).toString())}
      </Text>
    </View>
  );
}
