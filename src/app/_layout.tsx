import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, Stack } from "expo-router";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import "react-native-reanimated";

import { Contexts } from "@/contexts";

import { theme } from "@/styles/theme";

export default function RootLayout() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/");
      }
    }, 500);
  }, [user, loading]);

  if (!fontsLoaded || loading) {
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="new-transaction/index"
          options={{ headerShown: false }}
        />
      </Stack>
    </Contexts>
  );
}
