import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import firestore from "@react-native-firebase/firestore";

import { useStorage } from "@/hooks/use-storage";

import { Header } from "@/components/header";
import { Layout } from "@/components/layout";

import { formatCurrency, onlyNumbers } from "@/helpers/masks";
import { styles } from "./styles";
import { categories, categoriesMapped } from "@/constants/categories";
import { typesMapped } from "@/constants/types";

export default function NewTransaction() {
  const [newTransactionForm, setNewTransactionForm] = useState({
    type: "entrada",
    value: "0",
    category: "",
    date: new Date(),
    description: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { getUserStorage } = useStorage();

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
        userId: userLoggedId,
        type: typesMapped[newTransactionForm.type],
        category: categoriesMapped[newTransactionForm.category],
        value: valorFinal,
        date: firestore.Timestamp.fromDate(newTransactionForm.date),
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection("transactions").add(data);

      Alert.alert("Sucesso", "Transação salva com sucesso.", [
        {
          text: "OK",
          onPress: () => router.push("/home"),
        },
      ]);

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

      <View style={styles.container}>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[
              styles.radio,
              newTransactionForm.type === "entrada" && styles.radioSelected,
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
            <Text style={styles.radioText}>Entrada</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radio,
              newTransactionForm.type === "saida" && styles.radioSelected,
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
            <Text style={styles.radioText}>Saída</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.boxValue}>
          <Text style={styles.title}>Valor</Text>
          <TextInput
            style={styles.input}
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

        <View style={styles.boxValue}>
          <Text style={styles.title}>Categoria</Text>
          <View style={styles.pickerWrapper}>
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

        <View style={styles.boxValue}>
          <Text style={styles.title}>Data</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
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

        <View style={styles.boxValue}>
          <Text style={styles.title}>Descrição</Text>

          <TextInput
            style={[styles.input, { height: 80 }]}
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

        <TouchableOpacity style={styles.button} onPress={saveTransaction}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
