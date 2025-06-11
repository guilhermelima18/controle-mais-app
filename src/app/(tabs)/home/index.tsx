import { router } from "expo-router";
import { Car, Plus, Smile, Utensils } from "lucide-react-native";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { CardSummary } from "@/components/cards/card-summary";
import { Header } from "@/components/header";
import { Layout } from "@/components/layout";

import { theme } from "@/styles/theme";
import { styles } from "./styles";

const categorias = [
  {
    id: "1",
    nome: "Alimentação",
    valor: "R$ 1.200,00",
    icon: Utensils,
    bgColor: "#E6F0FA",
    iconColor: "#1E88E5",
  },
  {
    id: "2",
    nome: "Transporte",
    valor: "R$ 550,00",
    icon: Car,
    bgColor: "#E3F9E5",
    iconColor: "#43A047",
  },
  {
    id: "3",
    nome: "Lazer",
    valor: "R$ 230,00",
    icon: Smile,
    bgColor: "#FFF4E5",
    iconColor: "#FB8C00",
  },
];

export default function HomeScreen() {
  return (
    <Layout>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <>
            <Header title="Finanças" />

            <View style={styles.summaryContainer}>
              <CardSummary
                bgColor={theme.colors.blue[300]}
                titleColor={theme.colors.white[500]}
                valueColor={theme.colors.white[500]}
                title="Saldo atual"
                value="R$ 2.450,00"
                hasBorder={false}
              />

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <CardSummary
                    bgColor={theme.colors.white[500]}
                    titleColor={theme.colors.gray[900]}
                    valueColor={theme.colors.green[500]}
                    title="Entradas"
                    value="R$ 3.000,00"
                  />
                </View>

                <View style={styles.halfWidth}>
                  <CardSummary
                    bgColor={theme.colors.white[500]}
                    titleColor={theme.colors.gray[900]}
                    valueColor={theme.colors.red[500]}
                    title="Saídas"
                    value="R$ 55.550,00"
                  />
                </View>
              </View>
            </View>

            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>Gastos por categoria</Text>
            </View>
          </>
        }
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <View
              style={[styles.itemContainer, { backgroundColor: item.bgColor }]}
            >
              <View style={styles.iconWrapper}>
                <Icon size={20} color={item.iconColor} />
              </View>
              <View style={styles.itemTextWrapper}>
                <Text style={styles.itemTitle}>{item.nome}</Text>
              </View>
              <Text style={styles.itemValue}>{item.valor}</Text>
            </View>
          );
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/new-transaction")}
      >
        <Plus size={28} color={theme.colors.white[500]} />
      </TouchableOpacity>
    </Layout>
  );
}
