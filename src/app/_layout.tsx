import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { theme } from "@/styles/theme";
import "react-native-reanimated";

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!loaded) {
    return <ActivityIndicator color={theme.colors.blue[700]} size="large" />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="new-transaction"
            options={{ headerShown: false }}
          />
        </Stack>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
