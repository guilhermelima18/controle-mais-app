import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, Trash } from "lucide-react-native";

import { useTransactions } from "@/hooks/use-transactions";

import { Header } from "@/components/header";
import { Layout } from "@/components/layout";
import { CardEmpty } from "@/components/cards/card-empty";

import { months } from "@/constants/months";

import { formatCurrency } from "@/helpers/masks";
import { categoryIcons } from "@/helpers/functions/categories-icons";
import { theme } from "@/styles/theme";

export default function Transactions() {
  const [periodSelected, setPeriodSelected] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const currentYear = new Date().getFullYear();

  const {
    transactions,
    transactionsLoading,
    getUserTransactionsByMonth,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const handleUpdateTransaction = async (transactionId: string) => {
    await updateTransaction({
      transactionId,
      data: {
        hasCompleted: true,
      },
    });

    await getUserTransactionsByMonth({
      selectedMonth: periodSelected,
      year: currentYear,
    });
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    await deleteTransaction({
      transactionId,
    });

    await getUserTransactionsByMonth({
      selectedMonth: periodSelected,
      year: currentYear,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);

    await getUserTransactionsByMonth({
      selectedMonth: periodSelected,
      year: currentYear,
    });

    setRefreshing(false);
  };

  useEffect(() => {
    getUserTransactionsByMonth({
      selectedMonth: periodSelected,
      year: currentYear,
    });
  }, [periodSelected]);

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
          <Header title="Transações" />

          <View
            style={{
              flex: 1,
              marginTop: 20,
            }}
          >
            <Text
              style={{ marginHorizontal: 20, fontWeight: "600", fontSize: 16 }}
            >
              Filtre por mês:
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                marginVertical: 20,
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

            <View style={{ flex: 1, flexDirection: "column" }}>
              {transactions?.length === 0 ? (
                <View style={{ flex: 1 }}>
                  <CardEmpty text="Nenhuma transação encontrada para este mês." />
                </View>
              ) : (
                <FlatList
                  data={transactions}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    paddingBottom: 70,
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  renderItem={({ item }) => {
                    const timestampObj = item?.date;
                    const date = new Date(
                      timestampObj.seconds * 1000 +
                        timestampObj.nanoseconds / 1000000
                    );
                    const formattedDate = format(date, "dd'/'MM'/'yyyy", {
                      locale: ptBR,
                    });

                    const IconComponent =
                      categoryIcons[
                        item.category
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .toLowerCase()
                      ];

                    return (
                      <View
                        key={item.id}
                        style={{
                          backgroundColor: theme.colors.white[500],
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 12,
                          borderRadius: 12,
                          margin: 6,
                          borderWidth: 1,
                          borderColor: theme.colors.gray[500],
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "500",
                              color: theme.colors.gray[900],
                            }}
                          >
                            {formattedDate}
                          </Text>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <IconComponent
                              size={20}
                              color={theme.colors.gray[900]}
                              style={{ marginRight: 8 }}
                            />
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "500",
                                color: theme.colors.gray[900],
                              }}
                            >
                              {item.description}
                            </Text>
                          </View>

                          <Text
                            style={{
                              fontWeight: "600",
                              color:
                                item.type === "Entrada"
                                  ? theme.colors.green[500]
                                  : theme.colors.red[500],
                              fontSize: 18,
                            }}
                          >
                            {item.type === "Entrada"
                              ? `+ ${formatCurrency(
                                  Math.round(item.value * 100).toString()
                                )}`
                              : `- ${formatCurrency(
                                  Math.round(item.value * 100).toString()
                                )}`}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <Pressable
                            style={{
                              borderWidth: 1,
                              borderColor: theme.colors.green[500],
                              padding: 12,
                              borderRadius: 8,
                            }}
                            onPress={() => handleUpdateTransaction(item.id)}
                          >
                            <CheckCircle
                              color={theme.colors.green[500]}
                              size={22}
                            />
                          </Pressable>

                          <Pressable
                            style={{
                              borderWidth: 1,
                              borderColor: theme.colors.red[500],
                              padding: 12,
                              borderRadius: 8,
                            }}
                            onPress={() => handleDeleteTransaction(item.id)}
                          >
                            <Trash color={theme.colors.red[500]} size={22} />
                          </Pressable>
                        </View>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          </View>
        </>
      )}
    </Layout>
  );
}
