import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Header } from "@/components/header";
import { Layout } from "@/components/layout";
import { Trash } from "lucide-react-native";
import { theme } from "@/styles/theme";

export default function Feedbacks() {
  const [description, setDescription] = useState<string>();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();

  async function pickImage() {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Você precisa permitir acesso à galeria para escolher imagens."
      );

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      console.log("Imagem selecionada:", image);
      setImage(image);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Layout>
        <Header title="Feedbacks" />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              backgroundColor: "#fff",
              flex: 1,
              borderTopRightRadius: 40,
              borderTopLeftRadius: 40,
              marginTop: 0,
            }}
          >
            <View style={{ padding: 24, flexDirection: "column", gap: 2 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}
              >
                Descrição
              </Text>

              <TextInput
                style={{
                  height: 120,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  marginBottom: 16,
                }}
                value={description}
                onChangeText={setDescription}
                placeholder="Diga como podemos melhorar nosso app..."
                maxLength={500}
                multiline
              />

              {image && (
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Image
                    source={{ uri: image.uri }}
                    style={{ width: 300, height: 300, objectFit: "contain" }}
                  />

                  <TouchableOpacity
                    style={{ position: "absolute", right: 0, top: 0 }}
                    onPress={() => setImage(undefined)}
                  >
                    <Trash size={28} color={theme.colors.red[500]} />
                  </TouchableOpacity>
                </View>
              )}

              {!image && <Button title="Anexar imagem" onPress={pickImage} />}

              {description && image && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3b82f6",
                    padding: 16,
                    borderRadius: 8,
                    alignItems: "center",
                    marginTop: 24,
                  }}
                  /* onPress={saveTransaction} */
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    Enviar
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
