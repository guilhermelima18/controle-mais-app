import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
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
import { categoryColors } from "@/constants/categories";

export default function Transactions() {
  const [periodSelected, setPeriodSelected] = useState("");

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
              backgroundColor: "#fff",
              flex: 1,
              borderTopRightRadius: 40,
              borderTopLeftRadius: 40,
              marginTop: 0,
            }}
          >
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

            <View
              style={{
                flexDirection: "row",
                marginBottom: 20,
                marginHorizontal: 10,
                padding: 10,
                gap: 30,
              }}
            >
              {transactions &&
                transactions?.length > 0 &&
                transactions.map((item) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: item.hasCompleted
                          ? theme.colors.green[500]
                          : theme.colors.red[500],
                        width: 15,
                        height: 15,
                        borderRadius: 999,
                      }}
                    />
                    <Text style={{ fontSize: 18 }}>
                      {item.hasCompleted ? "Pagos" : "Não pagos"}
                    </Text>
                  </View>
                ))}
            </View>

            <View style={{ flex: 1, flexDirection: "column" }}>
              {transactions?.length === 0 ? (
                <View style={{ flex: 1 }}>
                  <CardEmpty text="Nenhuma transação encontrada para este mês." />
                </View>
              ) : (
                transactions &&
                transactions?.length > 0 &&
                transactions.map((transaction) => {
                  const timestampObj = transaction?.date;
                  const date = new Date(
                    timestampObj.seconds * 1000 +
                      timestampObj.nanoseconds / 1000000
                  );
                  const formattedDate = format(date, "dd'/'MM'/'yyyy", {
                    locale: ptBR,
                  });

                  const IconComponent =
                    categoryIcons[
                      transaction.category
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase()
                    ];

                  return (
                    <View
                      key={transaction.id}
                      style={{
                        backgroundColor: transaction.hasCompleted
                          ? theme.colors.green[500]
                          : theme.colors.red[500],
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 12,
                        borderRadius: 12,
                        margin: 6,
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
                            color: theme.colors.white[500],
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
                            {transaction.description}
                          </Text>
                        </View>

                        <Text
                          style={{
                            fontWeight: "600",
                            color: theme.colors.white[500],
                            fontSize: 18,
                          }}
                        >
                          {transaction.type === "Entrada"
                            ? `+ ${formatCurrency(
                                Math.round(transaction.value * 100).toString()
                              )}`
                            : `- ${formatCurrency(
                                Math.round(transaction.value * 100).toString()
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
                            borderColor: theme.colors.white[500],
                            padding: 12,
                            borderRadius: 8,
                          }}
                          onPress={() =>
                            handleUpdateTransaction(transaction.id)
                          }
                        >
                          <CheckCircle
                            color={theme.colors.white[500]}
                            size={22}
                          />
                        </Pressable>

                        <Pressable
                          style={{
                            borderWidth: 1,
                            borderColor: theme.colors.white[500],
                            padding: 12,
                            borderRadius: 8,
                          }}
                          onPress={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                        >
                          <Trash color={theme.colors.white[500]} size={22} />
                        </Pressable>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </>
      )}
    </Layout>
  );
}
