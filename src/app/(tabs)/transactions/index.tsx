import { Header } from "@/components/header";
import { Layout } from "@/components/layout";
import { months } from "@/constants/months";
import { theme } from "@/styles/theme";
import { Picker } from "@react-native-picker/picker";
import { Car, Smile, Utensils } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

const categorias = [
  {
    id: "1",
    nome: "Alimentação",
    valor: "R$ 1.200,00",
    icon: Utensils,
    iconColor: "#1E88E5",
    type: "entrada",
    date: "09/06/2025",
  },
  {
    id: "2",
    nome: "Transporte",
    valor: "R$ 550,00",
    icon: Car,
    iconColor: "#43A047",
    type: "saida",
    date: "07/06/2025",
  },
  {
    id: "3",
    nome: "Lazer",
    valor: "R$ 230,00",
    icon: Smile,
    iconColor: "#FB8C00",
    type: "entrada",
    date: "10/06/2025",
  },
];

export default function Transactions() {
  const [periodSelected, setPeriodSelected] = useState("");

  return (
    <Layout>
      <Header title="Transações" />

      <View
        style={{
          backgroundColor: "#fff",
          flex: 1,
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          marginTop: -100,
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            marginVertical: 40,
            marginHorizontal: 20,
          }}
        >
          <Picker
            selectedValue={periodSelected}
            onValueChange={(itemValue) => setPeriodSelected(itemValue)}
          >
            {months.map((month) => (
              <Picker.Item
                key={month.value}
                label={month.label}
                value={month.value}
              />
            ))}
          </Picker>
        </View>

        <View>
          {categorias.map((category) => {
            const Icon = category.icon;

            return (
              <View
                key={category.id}
                style={[
                  styles.itemContainer,
                  { backgroundColor: theme.colors.gray[300] },
                ]}
              >
                <View style={styles.iconWrapper}>
                  <Icon size={20} color={category.iconColor} />
                </View>
                <View style={styles.itemTextWrapper}>
                  <Text style={styles.itemTitle}>{category.nome}</Text>
                  <Text style={styles.itemTitle}>{category.date}</Text>
                </View>
                <Text
                  style={[
                    category.type === "entrada"
                      ? { ...styles.itemValue, color: theme.colors.green[500] }
                      : { ...styles.itemValue, color: theme.colors.red[500] },
                  ]}
                >
                  {category.type === "entrada"
                    ? `+ ${category.valor}`
                    : `- ${category.valor}`}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </Layout>
  );
}
