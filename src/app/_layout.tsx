import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import "react-native-reanimated";
import auth from "@react-native-firebase/auth";

import { Contexts } from "@/contexts";

import { theme } from "@/styles/theme";

export default function RootLayout() {
  const user = auth().currentUser;

  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={theme.colors.blue[700]} size="large" />
      </View>
    );
  }

  return (
    <Contexts>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName={user?.uid ? "home/index" : "index"}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="transactions/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="transactions/new-transaction/index"
          options={{ headerShown: false }}
        />
      </Stack>
    </Contexts>
  );
}
