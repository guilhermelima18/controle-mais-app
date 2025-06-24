import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import firestore from "@react-native-firebase/firestore";

import { useStorage } from "@/hooks/use-storage";
import { useAssets } from "@/hooks/use-assets";

import { Header } from "@/components/header";
import { Layout } from "@/components/layout";

import { assets, assetsMapped } from "@/constants/assets";
import { assetsTypesMapped } from "@/constants/types";
import { formatCurrency, onlyNumbers } from "@/helpers/masks";

import { theme } from "@/styles/theme";

export default function NewAsset() {
  const [newAssetForm, setNewAssetForm] = useState({
    type: "compra",
    asset_type: "acoes",
    asset: "",
    date: new Date(),
    quantity: "",
    price: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { getUserStorage } = useStorage();
  const { createAsset } = useAssets();

  const saveTransaction = async () => {
    let userLoggedId;
    const userLoggedStorage = await getUserStorage();

    if (userLoggedStorage && userLoggedStorage.id) {
      userLoggedId = userLoggedStorage.id;
    }

    const valorFinal = Number(newAssetForm.price.replace(/\D/g, "")) / 100;

    try {
      const data = {
        ...newAssetForm,
        userId: userLoggedId as string,
        type: assetsTypesMapped[newAssetForm.type],
        asset_type: assetsMapped[newAssetForm.asset_type],
        price: valorFinal,
        date: firestore.Timestamp.fromDate(newAssetForm.date),
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await createAsset(data);

      setNewAssetForm({
        type: "compra",
        asset_type: "acoes",
        asset: "",
        date: new Date(),
        quantity: "",
        price: "",
      });
    } catch (error) {
      console.error("Erro ao salvar ativo:", error);
      Alert.alert("Erro", "Erro ao salvar ativo.");
    }
  };

  return (
    <Layout>
      <Header title="Adicionar ativo" />

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
        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            style={[
              {
                flex: 1,
                padding: 12,
                marginRight: 8,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                alignItems: "center",
              },
              newAssetForm.type === "compra" && {
                backgroundColor: "#e0e7ff",
                borderColor: "#3b82f6",
              },
            ]}
            onPress={() =>
              setNewAssetForm((prev) => {
                return {
                  ...prev,
                  type: "compra",
                };
              })
            }
          >
            <Text
              style={{
                fontWeight: "500",
              }}
            >
              Compra
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flex: 1,
                padding: 12,
                marginRight: 8,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                alignItems: "center",
              },
              newAssetForm.type === "venda" && {
                backgroundColor: "#e0e7ff",
                borderColor: "#3b82f6",
              },
            ]}
            onPress={() =>
              setNewAssetForm((prev) => {
                return {
                  ...prev,
                  type: "venda",
                };
              })
            }
          >
            <Text
              style={{
                fontWeight: "500",
              }}
            >
              Venda
            </Text>
          </TouchableOpacity>
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
            Tipo de ativo
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
              selectedValue={newAssetForm.asset_type}
              onValueChange={(itemValue) => {
                setNewAssetForm((prev) => {
                  return {
                    ...prev,
                    asset_type: itemValue,
                  };
                });
              }}
            >
              {assets.map((asset) => (
                <Picker.Item
                  key={asset.value}
                  label={asset.label}
                  value={asset.value}
                />
              ))}
            </Picker>
          </View>
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
            Ativo
          </Text>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="Digite o ativo..."
            value={newAssetForm.asset}
            onChangeText={(text) => {
              setNewAssetForm((prev) => {
                return {
                  ...prev,
                  asset: text.toUpperCase(),
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
            Data da {newAssetForm.type === "compra" ? "compra" : "venda"}
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
            <Text>{format(newAssetForm.date, "dd/MM/yyyy")}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={newAssetForm.date}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || newAssetForm.date;
              setShowDatePicker(false);

              setNewAssetForm((prev) => {
                return {
                  ...prev,
                  date: currentDate,
                };
              });
            }}
          />
        )}

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
            Quantidade
          </Text>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="Digite a quantidade..."
            keyboardType="numeric"
            value={newAssetForm.quantity}
            onChangeText={(text) => {
              setNewAssetForm((prev) => {
                return {
                  ...prev,
                  quantity: onlyNumbers(text),
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
            Preço
          </Text>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="Digite a preço..."
            keyboardType="numeric"
            value={formatCurrency(newAssetForm.price)}
            onChangeText={(text) => {
              setNewAssetForm((prev) => {
                return {
                  ...prev,
                  price: onlyNumbers(text),
                };
              });
            }}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.blue[700],
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 8,
          }}
          onPress={saveTransaction}
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
    </Layout>
  );
}
