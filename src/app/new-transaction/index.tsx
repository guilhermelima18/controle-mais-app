import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import firestore from "@react-native-firebase/firestore";

import { useStorage } from "@/hooks/use-storage";
import { useTransactions } from "@/hooks/use-transactions";

import { Header } from "@/components/header";
import { Layout } from "@/components/layout";

import { categories, categoriesMapped } from "@/constants/categories";
import { typesMapped } from "@/constants/types";
import { formatCurrency, onlyNumbers } from "@/helpers/masks";

import { theme } from "@/styles/theme";

export default function NewTransaction() {
  const [newTransactionForm, setNewTransactionForm] = useState({
    type: "entrada",
    value: "0",
    category: "alimentacao",
    date: new Date(),
    description: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { getUserStorage } = useStorage();
  const { createTransaction } = useTransactions();

  const saveTransaction = async () => {
    let userLoggedId;
    const userLoggedStorage = await getUserStorage();

    if (userLoggedStorage && userLoggedStorage.id) {
      userLoggedId = userLoggedStorage.id;
    }

    const valorFinal =
      Number(newTransactionForm.value.replace(/\D/g, "")) / 100;

    try {
      const data = {
        ...newTransactionForm,
        userId: userLoggedId as string,
        type: typesMapped[newTransactionForm.type],
        category: categoriesMapped[newTransactionForm.category],
        value: valorFinal,
        date: firestore.Timestamp.fromDate(newTransactionForm.date),
        createdAt: firestore.FieldValue.serverTimestamp(),
        hasCompleted: false,
      };

      await createTransaction(data);

      setNewTransactionForm({
        type: "entrada",
        value: "",
        category: "alimentacao",
        date: new Date(),
        description: "",
      });
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      Alert.alert("Erro", "Erro ao salvar transação.");
    }
  };

  return (
    <Layout>
      <Header title="Adicionar transação" />

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
              newTransactionForm.type === "entrada" && {
                backgroundColor: "#e0e7ff",
                borderColor: "#3b82f6",
              },
            ]}
            onPress={() =>
              setNewTransactionForm((prev) => {
                return {
                  ...prev,
                  type: "entrada",
                };
              })
            }
          >
            <Text
              style={{
                fontWeight: "500",
              }}
            >
              Entrada
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
              newTransactionForm.type === "saida" && {
                backgroundColor: "#e0e7ff",
                borderColor: "#3b82f6",
              },
            ]}
            onPress={() =>
              setNewTransactionForm((prev) => {
                return {
                  ...prev,
                  type: "saida",
                };
              })
            }
          >
            <Text
              style={{
                fontWeight: "500",
              }}
            >
              Saída
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
            Valor
          </Text>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="R$"
            keyboardType="numeric"
            value={formatCurrency(newTransactionForm.value)}
            onChangeText={(text) => {
              setNewTransactionForm((prev) => {
                return {
                  ...prev,
                  value: onlyNumbers(text),
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
              selectedValue={newTransactionForm.category}
              onValueChange={(itemValue) => {
                setNewTransactionForm((prev) => {
                  return {
                    ...prev,
                    category: itemValue,
                  };
                });
              }}
            >
              {categories.map((category) => (
                <Picker.Item
                  key={category.value}
                  label={category.label}
                  value={category.value}
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
            Data
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
            <Text>{format(newTransactionForm.date, "dd/MM/yyyy")}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={newTransactionForm.date}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || newTransactionForm.date;
              setShowDatePicker(false);

              setNewTransactionForm((prev) => {
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
            Descrição
          </Text>

          <TextInput
            style={{
              height: 80,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="Descrição"
            value={newTransactionForm.description}
            onChangeText={(text) =>
              setNewTransactionForm((prev) => {
                return {
                  ...prev,
                  description: text,
                };
              })
            }
            multiline
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
