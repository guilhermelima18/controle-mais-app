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
import { useTransactions } from "@/hooks/use-transactions";

import { Header } from "@/components/header";
import { Layout } from "@/components/layout";

import { categories, categoriesMapped } from "@/constants/categories";
import { typesMapped } from "@/constants/types";
import { formatCurrency, onlyNumbers } from "@/helpers/masks";

import { theme } from "@/styles/theme";

export default function NewTransaction() {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      type: "entrada",
      value: "0",
      category: "alimentacao",
      date: new Date(),
      description: "",
    },
  });

  const selectedDate = watch("date");
  const selectedType = watch("type");

  const { getUserStorage } = useStorage();
  const { createTransaction } = useTransactions();

  const saveTransaction = async (formData: FieldValues) => {
    let userLoggedId;
    const userLoggedStorage = await getUserStorage();

    if (userLoggedStorage && userLoggedStorage.id) {
      userLoggedId = userLoggedStorage.id;
    }

    const valorFinal = Number(formData.value.replace(/\D/g, "")) / 100;

    try {
      const data = {
        ...formData,
        userId: userLoggedId as string,
        type: typesMapped[formData.type],
        category: categoriesMapped[formData.category],
        description: formData.description,
        value: valorFinal,
        date: firestore.Timestamp.fromDate(formData.date),
        createdAt: firestore.FieldValue.serverTimestamp(),
        hasCompleted: false,
      };

      await createTransaction(data);

      reset();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      Alert.alert("Erro", "Erro ao salvar transação.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Layout>
        <Header title="Adicionar transação" />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flex: 1,
              padding: 24,
              backgroundColor: "#fff",
              borderTopRightRadius: 40,
              borderTopLeftRadius: 40,
            }}
          >
            <View style={{ flexDirection: "row", marginBottom: 16 }}>
              {["entrada", "saida"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    {
                      flex: 1,
                      padding: 12,
                      marginRight: type === "entrada" ? 8 : 0,
                      borderWidth: 1,
                      borderRadius: 8,
                      alignItems: "center",
                      backgroundColor:
                        selectedType === type ? "#e0e7ff" : undefined,
                      borderColor: selectedType === type ? "#3b82f6" : "#ccc",
                    },
                  ]}
                  onPress={() => setValue("type", type)}
                >
                  <Text style={{ fontWeight: "500" }}>
                    {type === "entrada" ? "Entrada" : "Saída"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ fontSize: 18, fontWeight: "600" }}>Valor</Text>
            <Controller
              control={control}
              name="value"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  placeholder="R$"
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

            <Text style={{ fontSize: 18, fontWeight: "600" }}>Categoria</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <Controller
                control={control}
                name="category"
                render={({ field: { value, onChange } }) => (
                  <Picker selectedValue={value} onValueChange={onChange}>
                    {categories.map((category) => (
                      <Picker.Item
                        key={category.value}
                        label={category.label}
                        value={category.value}
                      />
                    ))}
                  </Picker>
                )}
              />
            </View>

            <Text style={{ fontSize: 18, fontWeight: "600" }}>Data</Text>
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
                  const currentDate = selectedDate || new Date();
                  setShowDatePicker(false);
                  setValue("date", currentDate);
                }}
              />
            )}

            <Text style={{ fontSize: 18, fontWeight: "600" }}>Descrição</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  placeholder="Descrição"
                  multiline
                  value={value}
                  onChangeText={onChange}
                  style={{
                    height: 80,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                  }}
                />
              )}
            />

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
                style={{ color: theme.colors.white[500], fontWeight: "600" }}
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
