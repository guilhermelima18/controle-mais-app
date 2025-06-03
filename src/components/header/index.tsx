import { Dimensions, Text, View } from "react-native";

import { theme } from "@/styles/theme";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  const windowHeight = Dimensions.get("window").height;

  return (
    <View
      style={{
        backgroundColor: theme.colors.blue[700],
        width: "100%",
        height: windowHeight - 600,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontWeight: "600",
          color: theme.colors.white[500],
          fontSize: 28,
        }}
      >
        {title}
      </Text>
    </View>
  );
}
