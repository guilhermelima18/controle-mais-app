import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";

import { useTransactions } from "@/hooks/use-transactions";

import { CardSummary } from "@/components/cards/card-summary";
import { Header } from "@/components/header";
import { Layout } from "@/components/layout";

import { formatCurrency } from "@/helpers/masks";

import { theme } from "@/styles/theme";
import { styles } from "./styles";

export default function Home() {
  const { transactions, transactionsLoading, getUserTransactions } =
    useTransactions();

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
        <FlatList
          data={transactions}
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
            return (
              <View style={styles.itemContainer}>
                <View style={styles.itemTextWrapper}>
                  <Text style={styles.itemTitle}>{item.description}</Text>
                </View>
                <Text style={styles.itemValue}>
                  {formatCurrency(Math.round(item?.value * 100).toString())}
                </Text>
              </View>
            );
          }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/transactions/new-transaction")}
      >
        <Plus size={28} color={theme.colors.white[500]} />
      </TouchableOpacity>
    </Layout>
  );
}
