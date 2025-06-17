import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

import { useUserContext } from "@/contexts/user";

import { Layout } from "@/components/layout";
import { theme } from "@/styles/theme";

export default function SignIn() {
  const { signInLoading, handleGoogleSignIn } = useUserContext();

  const handleSignIn = async () => {
    const result = await handleGoogleSignIn();

    if (result && result.user.id) {
      router.push("/home");
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Image
          source={require("../assets/icons/logo.png")}
          style={{
            width: 200,
            height: 100,
            resizeMode: "contain",
          }}
        />

        <Text style={styles.subtitle}>Gerencie suas finanças de forma</Text>
        <Text style={styles.subtitle}>simples e visual!</Text>

        {signInLoading ? (
          <View>
            <ActivityIndicator color={theme.colors.blue[700]} size="large" />
          </View>
        ) : (
          <TouchableOpacity style={styles.googleButton} onPress={handleSignIn}>
            <Image
              source={require("../assets/icons/google-icon.png")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Entrar com Google</Text>
          </TouchableOpacity>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 20,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
});
