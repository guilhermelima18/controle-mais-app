import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Header } from "@/components/header";
import { Layout } from "@/components/layout";

import { formatCurrency, onlyNumbers } from "@/helpers/masks";
import { styles } from "./styles";

export default function NewTransaction() {
  const [newTransactionForm, setNewTransactionForm] = useState({
    type: "entrada",
    value: "",
    category: "",
    date: new Date(),
    description: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const saveTransaction = async () => {
    let userLogged;

    const userLoggedStorage = await AsyncStorage.getItem("@controlemais:user");

    if (userLoggedStorage) {
      userLogged = JSON.parse(userLoggedStorage);
    }

    const valorFinal =
      Number(newTransactionForm.value.replace(/\D/g, "")) / 100;

    try {
      const data = {
        ...newTransactionForm,
        userId: userLogged.id,
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
        category: "",
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
              onValueChange={(itemValue) =>
                setNewTransactionForm((prev) => {
                  return {
                    ...prev,
                    category: itemValue,
                  };
                })
              }
            >
              <Picker.Item label="Alimentação" value="alimentacao" />
              <Picker.Item label="Transporte" value="transporte" />
              <Picker.Item label="Lazer" value="lazer" />
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
            display="default"
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
