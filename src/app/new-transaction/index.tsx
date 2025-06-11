import { Header } from "@/components/header";
import { Layout } from "@/components/layout";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export default function NewTransaction() {
  const [newTransactionForm, setNewTransactionForm] = useState({
    type: "",
    value: "",
    category: "",
    date: new Date(),
    description: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

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
            value={newTransactionForm.value}
            onChangeText={(text) =>
              setNewTransactionForm((prev) => {
                return {
                  ...prev,
                  value: text,
                };
              })
            }
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

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
