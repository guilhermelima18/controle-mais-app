import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  Book,
  HeartPulse,
  LucideIcon,
  Plus,
  ShoppingCart,
  Smile,
  Truck,
  Home as HomeIcon,
  Shirt,
  Briefcase,
  LineChart,
  CircleHelp,
} from "lucide-react-native";

import { useTransactions } from "@/hooks/use-transactions";

import { CardSummary } from "@/components/cards/card-summary";
import { Header } from "@/components/header";
import { Layout } from "@/components/layout";
import { CardEmpty } from "@/components/cards/card-empty";

import { formatCurrency } from "@/helpers/masks";
import { categoryColors } from "@/constants/categories";

import { theme } from "@/styles/theme";
import { styles } from "./styles";

export const categoryIcons: Record<string, LucideIcon> = {
  alimentacao: ShoppingCart,
  transportes: Truck,
  lazer: Smile,
  saude: HeartPulse,
  educacao: Book,
  moradia: HomeIcon,
  compras: Shirt,
  trabalho: Briefcase,
  investimentos: LineChart,
  outros: CircleHelp,
};

export default function Home() {
  const { transactions, transactionsLoading, getUserTransactions } =
    useTransactions();

  const transactionsPerCategory = transactions.reduce((acc, item) => {
    const key = item.category;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof transactions>);

  const data = Object.entries(transactionsPerCategory).map(
    ([category, items]) => {
      const total = items.reduce((sum, item) => sum + item.value, 0);
      return {
        category,
        total,
        items,
      };
    }
  );

  const totalTransactions = useMemo(() => {
    return transactions.reduce((acc, item) => {
      return (acc += item.value);
    }, 0);
  }, [transactions]);

  const totalIncomingTransactions = useMemo(() => {
    return transactions.reduce((acc, item) => {
      if (
        item.type
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() === "entrada"
      ) {
        acc += item.value;
      }

      return acc;
    }, 0);
  }, [transactions]);

  const totalOutgoingTransactions = useMemo(() => {
    return transactions.reduce((acc, item) => {
      if (
        item.type
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() === "saida"
      ) {
        acc += item.value;
      }

      return acc;
    }, 0);
  }, [transactions]);

  useEffect(() => {
    getUserTransactions();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <Layout>
          {transactionsLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator color={theme.colors.blue[700]} size="large" />
            </View>
          ) : (
            <>
              <Header title="Resumo" />

              <View style={styles.summaryContainer}>
                <CardSummary
                  bgColor={theme.colors.blue[300]}
                  titleColor={theme.colors.white[500]}
                  valueColor={theme.colors.white[500]}
                  title="Saldo atual"
                  value={totalTransactions}
                  hasBorder={false}
                />

                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <CardSummary
                      bgColor={theme.colors.white[500]}
                      titleColor={theme.colors.gray[900]}
                      valueColor={theme.colors.green[500]}
                      title="Entradas"
                      value={totalIncomingTransactions}
                    />
                  </View>

                  <View style={styles.halfWidth}>
                    <CardSummary
                      bgColor={theme.colors.white[500]}
                      titleColor={theme.colors.gray[900]}
                      valueColor={theme.colors.red[500]}
                      title="Saídas"
                      value={totalOutgoingTransactions}
                    />
                  </View>
                </View>
              </View>

              {data && data?.length > 0 && (
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>Gastos por categoria</Text>
                </View>
              )}

              {data && data?.length > 0 ? (
                <FlatList
                  data={data}
                  keyExtractor={(item) => item.category}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.contentContainer}
                  renderItem={(transactions) => {
                    const IconComponent =
                      categoryIcons[
                        transactions.item.category
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .toLowerCase()
                      ];
                    <IconComponent
                      size={24}
                      color="#333"
                      style={{ marginRight: 8 }}
                    />;

                    return (
                      <View
                        style={[
                          styles.itemContainer,
                          {
                            backgroundColor:
                              categoryColors[
                                transactions.item.category
                                  .normalize("NFD")
                                  .replace(/[\u0300-\u036f]/g, "")
                                  .toLowerCase()
                              ],
                          },
                        ]}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <IconComponent size={20} style={{ marginRight: 8 }} />
                          <Text style={styles.itemTitle}>
                            {transactions.item.category}
                          </Text>
                        </View>

                        <Text style={styles.itemValue}>
                          {formatCurrency(
                            Math.round(
                              transactions.item?.total * 100
                            ).toString()
                          )}
                        </Text>
                      </View>
                    );
                  }}
                />
              ) : (
                <View style={{ flex: 1 }}>
                  <CardEmpty text="Nenhuma categoria encontrada." />
                </View>
              )}
            </>
          )}

          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push("/new-transaction")}
          >
            <Plus size={28} color={theme.colors.white[500]} />
          </TouchableOpacity>
        </Layout>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
