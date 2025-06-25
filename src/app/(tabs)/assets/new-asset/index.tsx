import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import firestore from "@react-native-firebase/firestore";
import { Controller, FieldValues, useForm } from "react-hook-form";

import { useStorage } from "@/hooks/use-storage";
import { useAssets } from "@/hooks/use-assets";

import { Header } from "@/components/header";
import { Layout } from "@/components/layout";

import { assets, assetsMapped } from "@/constants/assets";
import { assetsTypesMapped } from "@/constants/types";
import { formatCurrency, onlyNumbers } from "@/helpers/masks";

import { theme } from "@/styles/theme";

export default function NewAsset() {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      type: "compra",
      asset_type: "acoes",
      asset: "",
      date: new Date(),
      quantity: "",
      price: "",
    },
  });

  const selectedType = watch("type");
  const selectedDate = watch("date");

  const { getUserStorage } = useStorage();
  const { createAsset } = useAssets();

  const saveTransaction = async (formData: FieldValues) => {
    let userLoggedId;
    const userLoggedStorage = await getUserStorage();

    if (userLoggedStorage && userLoggedStorage.id) {
      userLoggedId = userLoggedStorage.id;
    }

    const valorFinal = Number(formData.price.replace(/\D/g, "")) / 100;

    try {
      const data = {
        ...formData,
        userId: userLoggedId as string,
        type: assetsTypesMapped[formData.type],
        asset: formData.asset,
        asset_type: assetsMapped[formData.asset_type],
        price: valorFinal,
        quantity: formData.quantity,
        date: firestore.Timestamp.fromDate(formData.date),
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await createAsset(data);

      reset();
    } catch (error) {
      console.error("Erro ao salvar ativo:", error);
      Alert.alert("Erro", "Erro ao salvar ativo.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Layout>
        <Header title="Adicionar ativo" />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flex: 1,
              padding: 24,
              backgroundColor: "#fff",
              marginTop: 0,
              borderTopRightRadius: 40,
              borderTopLeftRadius: 40,
            }}
          >
            {/* Tipo */}
            <View style={{ flexDirection: "row", marginBottom: 16 }}>
              {["compra", "venda"].map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    {
                      flex: 1,
                      padding: 12,
                      marginRight: tipo === "compra" ? 8 : 0,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      alignItems: "center",
                    },
                    selectedType === tipo && {
                      backgroundColor: "#e0e7ff",
                      borderColor: "#3b82f6",
                    },
                  ]}
                  onPress={() => setValue("type", tipo)}
                >
                  <Text style={{ fontWeight: "500" }}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tipo de ativo */}
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              Tipo de ativo
            </Text>
            <Controller
              control={control}
              name="asset_type"
              render={({ field: { onChange, value } }) => (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                >
                  <Picker selectedValue={value} onValueChange={onChange}>
                    {assets.map((asset) => (
                      <Picker.Item
                        key={asset.value}
                        label={asset.label}
                        value={asset.value}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />

            {/* Ativo */}
            <Text style={{ fontSize: 18, fontWeight: "600" }}>Ativo</Text>
            <Controller
              control={control}
              name="asset"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Digite o ativo..."
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                  }}
                />
              )}
            />

            {/* Data */}
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              Data da {selectedType === "compra" ? "compra" : "venda"}
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <Text>{format(selectedDate, "dd/MM/yyyy")}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setValue("date", selectedDate);
                  }
                  setShowDatePicker(false);
                }}
              />
            )}

            {/* Quantidade */}
            <Text style={{ fontSize: 18, fontWeight: "600" }}>Quantidade</Text>
            <Controller
              control={control}
              name="quantity"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Digite a quantidade..."
                  keyboardType="numeric"
                  value={value}
                  onChangeText={(text) => onChange(onlyNumbers(text))}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                  }}
                />
              )}
            />

            {/* Preço */}
            <Text style={{ fontSize: 18, fontWeight: "600" }}>Preço</Text>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Digite o preço..."
                  keyboardType="numeric"
                  value={formatCurrency(value)}
                  onChangeText={(text) => onChange(onlyNumbers(text))}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                  }}
                />
              )}
            />

            {/* Botão Salvar */}
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.blue[700],
                padding: 16,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 8,
              }}
              onPress={handleSubmit(saveTransaction)}
            >
              <Text
                style={{
                  color: theme.colors.white[500],
                  fontWeight: "600",
                }}
              >
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
