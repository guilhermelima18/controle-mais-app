import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

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
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 20,
      }}
    >
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: theme.colors.gray[500],
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
        }}
        onPress={() => router.back()}
      >
        <ArrowLeft color={theme.colors.white[500]} />
      </TouchableOpacity>

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
