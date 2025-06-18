import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Car, Smile, Utensils } from "lucide-react-native";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useTransactions } from "@/hooks/use-transactions";

import { Header } from "@/components/header";
import { Layout } from "@/components/layout";
import { months } from "@/constants/months";

import { formatCurrency } from "@/helpers/masks";
import { theme } from "@/styles/theme";
import { styles } from "./styles";
import { CardEmpty } from "@/components/cards/card-empty";

export default function Transactions() {
  const [periodSelected, setPeriodSelected] = useState("");

  const { transactions, transactionsLoading, getUserTransactionsByMonth } =
    useTransactions();

  useEffect(() => {
    const currentYear = new Date().getFullYear();

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

                  return (
                    <View
                      key={transaction.id}
                      style={[
                        styles.itemContainer,
                        { backgroundColor: theme.colors.gray[300] },
                      ]}
                    >
                      <View style={styles.itemTextWrapper}>
                        <Text style={styles.itemTitle}>
                          {transaction.description} -
                        </Text>
                        <Text style={styles.itemTitle}>{formattedDate}</Text>
                      </View>
                      <Text
                        style={[
                          transaction.type === "Entrada"
                            ? {
                                ...styles.itemValue,
                                color: theme.colors.green[500],
                              }
                            : {
                                ...styles.itemValue,
                                color: theme.colors.red[500],
                              },
                        ]}
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
