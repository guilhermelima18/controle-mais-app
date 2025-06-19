import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, LogOut } from "lucide-react-native";
import auth from "@react-native-firebase/auth";

import { useStorage } from "@/hooks/use-storage";

import { theme } from "@/styles/theme";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  const windowHeight = Dimensions.get("window").height;

  const { deleteStorage } = useStorage();

  return (
    <View
      style={{
        backgroundColor: theme.colors.blue[700],
        width: "100%",
        height: 80,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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

      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.blue[700],
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
        }}
        onPress={async () => {
          await deleteStorage();
          await auth().signOut();

          router.push("/");
        }}
      >
        <LogOut color={theme.colors.white[500]} />
      </TouchableOpacity>
    </View>
  );
}
