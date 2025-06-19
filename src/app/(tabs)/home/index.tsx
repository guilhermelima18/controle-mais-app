import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";

import { useTransactions } from "@/hooks/use-transactions";

import { CardSummary } from "@/components/cards/card-summary";
import { Header } from "@/components/header";
import { Layout } from "@/components/layout";
import { CardEmpty } from "@/components/cards/card-empty";

import { formatCurrency } from "@/helpers/masks";
import { categoryIcons } from "@/helpers/functions/categories-icons";
import { categoryColors } from "@/constants/categories";

import { theme } from "@/styles/theme";

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = async () => {
    setRefreshing(true);

    await getUserTransactions();

    setRefreshing(false);
  };

  useEffect(() => {
    getUserTransactions();
  }, []);

  return (
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

          <View
            style={{
              width: "100%",
              flexDirection: "column",
              padding: 8,
              marginTop: 0,
              gap: 20,
            }}
          >
            <CardSummary
              bgColor={theme.colors.blue[300]}
              titleColor={theme.colors.white[500]}
              valueColor={theme.colors.white[500]}
              title="Saldo atual"
              value={totalTransactions}
              hasBorder={false}
            />

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 14,
              }}
            >
              <View
                style={{
                  width: "48%",
                }}
              >
                <CardSummary
                  bgColor={theme.colors.white[500]}
                  titleColor={theme.colors.gray[900]}
                  valueColor={theme.colors.green[500]}
                  title="Entradas"
                  value={totalIncomingTransactions}
                />
              </View>

              <View
                style={{
                  width: "48%",
                }}
              >
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
            <View
              style={{
                marginTop: 20,
                padding: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "500",
                  marginBottom: 12,
                }}
              >
                Gastos por categoria
              </Text>
            </View>
          )}

          {data && data?.length > 0 ? (
            <FlatList
              data={data}
              keyExtractor={(item) => item.category}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingBottom: 70,
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={(transactions) => {
                const IconComponent =
                  categoryIcons[
                    transactions.item.category
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()
                  ];

                return (
                  <View
                    style={{
                      backgroundColor:
                        categoryColors[
                          transactions.item.category
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                        ],
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 24,
                      borderRadius: 12,
                      margin: 6,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <IconComponent
                        size={20}
                        color={theme.colors.white[500]}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "500",
                          color: theme.colors.white[500],
                        }}
                      >
                        {transactions.item.category}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontWeight: "600",
                        color: theme.colors.white[500],
                      }}
                    >
                      {formatCurrency(
                        Math.round(transactions.item?.total * 100).toString()
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
        style={{
          backgroundColor: theme.colors.blue[700],
          width: 60,
          height: 60,
          borderRadius: 999999,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 10,
          right: 10,
          zIndex: 9999,
        }}
        onPress={() => router.push("/new-transaction")}
      >
        <Plus size={28} color={theme.colors.white[500]} />
      </TouchableOpacity>
    </Layout>
  );
}
