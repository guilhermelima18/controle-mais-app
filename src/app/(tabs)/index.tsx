import { Car, Plus, Smile, Utensils } from "lucide-react-native";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { CardSummary } from "@/components/cards/card-summary";
import { Header } from "@/components/header";
import { Layout } from "@/components/layout";

import { theme } from "@/styles/theme";

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
        contentContainerStyle={{
          paddingBottom: 70,
        }}
        ListHeaderComponent={
          <>
            <Header title="Finanças" />

            <View
              style={{
                width: "100%",
                flexDirection: "column",
                padding: 8,
                marginTop: -170,
                gap: 20,
              }}
            >
              <CardSummary
                bgColor={theme.colors.blue[300]}
                titleColor={theme.colors.white[500]}
                valueColor={theme.colors.white[500]}
                title="Saldo atual"
                value="R$ 2.450,00"
                hasBorder={false}
              />

              <View style={{ width: "100%", flexDirection: "row", gap: 14 }}>
                <View style={{ width: "48%" }}>
                  <CardSummary
                    bgColor={theme.colors.white[500]}
                    titleColor={theme.colors.gray[900]}
                    valueColor={theme.colors.green[500]}
                    title="Entradas"
                    value="R$ 3.000,00"
                  />
                </View>

                <View style={{ width: "48%" }}>
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

            <View style={{ marginTop: 20, padding: 4 }}>
              <Text
                style={{ fontSize: 22, fontWeight: "500", marginBottom: 12 }}
              >
                Gastos por categoria
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: item.bgColor,
                padding: 12,
                borderRadius: 12,
                margin: 6,
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFF",
                  padding: 8,
                  borderRadius: 50,
                  marginRight: 12,
                }}
              >
                <Icon size={20} color={item.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  {item.nome}
                </Text>
              </View>
              <Text style={{ fontWeight: "600" }}>{item.valor}</Text>
            </View>
          );
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.blue[700],
          width: 80,
          height: 80,
          borderRadius: 999999,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: -20,
          right: 10,
          zIndex: 9999,
        }}
      >
        <Plus color={theme.colors.white[500]} />
      </TouchableOpacity>
    </Layout>
  );
}
