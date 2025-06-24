import { useCallback, useMemo, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import { Trash } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";

import { useFeedbacks } from "@/hooks/use-feedbacks";

import { Header } from "@/components/header";
import { Layout } from "@/components/layout";

import { theme } from "@/styles/theme";
import { FeedbacksTypes } from "@/constants/feedbacks-types";

export default function Feedbacks() {
  const [feedback, setFeedback] = useState({
    title: "",
    description: "",
    type: "Sugestions",
  });
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [saveImageBucketLoading, setSaveImageBucketLoading] = useState(false);

  const {
    createFeedbackWebHookLoading,
    createFeedback,
    createFeedbackWebHook,
  } = useFeedbacks();

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

  const handleSaveImageFirebaseBucket = useCallback(async () => {
    try {
      setSaveImageBucketLoading(true);

      const user = auth().currentUser;

      if (!image || !user) return;

      // 2. Caminho no Storage (você pode personalizar)
      const fileName = image.fileName || `image_${Date.now()}`;
      const fileRef = storage().ref(`users/${user.uid}/${fileName}`);

      // 3. Faz o upload do arquivo usando o caminho local (URI)
      const task = fileRef.putFile(image.uri);

      // 4. Monitorar progresso (opcional)
      task.on("state_changed", (taskSnapshot) => {
        console.log(
          `Progresso: ${taskSnapshot.bytesTransferred} transferidos de ${taskSnapshot.totalBytes}`
        );
      });

      // 5. Espera o upload finalizar
      await task;
      const downloadURL = await fileRef.getDownloadURL();

      return downloadURL;
    } catch (error) {
      console.error("Erro no upload:", error);
    } finally {
      setSaveImageBucketLoading(false);
    }
  }, []);

  const handleSaveFeedback = useCallback(async () => {
    try {
      const uploadImageBucket = await handleSaveImageFirebaseBucket();
      console.log({ uploadImageBucket });

      const feedbackWeebhookObj = {
        title: feedback.title,
        description: feedback.description,
        type: feedback.type,
        attachment: [{ link: uploadImageBucket as string }],
      };

      const feedbackObj = {
        title: feedback.title,
        description: feedback.description,
        type: feedback.type,
        link: uploadImageBucket as string,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await createFeedback(feedbackObj);
      await createFeedbackWebHook(feedbackWeebhookObj);
    } catch (error) {
      console.error("Erro ao salvar feedback:", error);
    }
  }, []);

  const loading = useMemo(() => {
    return createFeedbackWebHookLoading || saveImageBucketLoading
      ? true
      : false;
  }, [createFeedbackWebHookLoading, saveImageBucketLoading]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Layout>
        {loading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color={theme.colors.blue[700]} size="large" />
          </View>
        ) : (
          <>
            <Header title="Feedbacks" />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View
                style={{
                  backgroundColor: "#fff",
                  flex: 1,
                  borderTopRightRadius: 40,
                  borderTopLeftRadius: 40,
                  marginTop: 0,
                  padding: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                    }}
                  >
                    Título
                  </Text>

                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 16,
                    }}
                    autoCapitalize="words"
                    placeholder="Digite o título..."
                    value={feedback.title}
                    onChangeText={(text) => {
                      setFeedback((prev) => {
                        return {
                          ...prev,
                          title: text,
                        };
                      });
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                    }}
                  >
                    Categoria
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                  >
                    <Picker
                      selectedValue={feedback.type}
                      onValueChange={(itemValue) => {
                        setFeedback((prev) => {
                          return {
                            ...prev,
                            type: itemValue,
                          };
                        });
                      }}
                    >
                      {FeedbacksTypes.map((feedback) => (
                        <Picker.Item
                          key={feedback.value}
                          label={feedback.label}
                          value={feedback.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={{ flexDirection: "column", gap: 2 }}>
                  <Text style={{ fontSize: 18, fontWeight: "600" }}>
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
                    value={feedback.description}
                    onChangeText={(text) => {
                      setFeedback((prev) => {
                        return {
                          ...prev,
                          description: text,
                        };
                      });
                    }}
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
                        style={{
                          width: 300,
                          height: 300,
                          objectFit: "contain",
                        }}
                      />

                      <TouchableOpacity
                        style={{ position: "absolute", right: 0, top: 0 }}
                        onPress={() => setImage(null)}
                      >
                        <Trash size={28} color={theme.colors.red[500]} />
                      </TouchableOpacity>
                    </View>
                  )}

                  {!image && (
                    <Button title="Anexar imagem" onPress={pickImage} />
                  )}

                  {feedback.description && image && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#3b82f6",
                        padding: 16,
                        borderRadius: 8,
                        alignItems: "center",
                        marginTop: 24,
                      }}
                      onPress={handleSaveFeedback}
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
          </>
        )}
      </Layout>
    </KeyboardAvoidingView>
  );
}
