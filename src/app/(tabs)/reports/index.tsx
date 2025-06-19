import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  FlatList,
  RefreshControl,
} from "react-native";
import { Pie, PolarChart } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";

import { useTransactions } from "@/hooks/use-transactions";

import { Layout } from "@/components/layout";
import { Header } from "@/components/header";

import { categoryColors } from "@/constants/categories";
import { theme } from "@/styles/theme";

export default function Reports() {
  const [refreshing, setRefreshing] = useState(false);

  const font = useFont(Poppins_400Regular, 12);
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

  const graphicsData = data.map((item) => ({
    label: item.category,
    value: item.total,
    color:
      categoryColors[
        item.category
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      ],
  }));

  const onRefresh = async () => {
    setRefreshing(true);

    await getUserTransactions();

    setRefreshing(false);
  };

  useEffect(() => {
    getUserTransactions();
  }, []);

  if (!font) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={theme.colors.blue[700]} size="large" />
      </View>
    );
  }

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
          <Header title="Relatórios" />

          <View
            style={{
              height: 300,
              marginTop: 40,
            }}
          >
            <PolarChart
              data={graphicsData}
              labelKey="label"
              valueKey="value"
              colorKey="color"
            >
              <Pie.Chart />
            </PolarChart>
          </View>

          <FlatList
            data={graphicsData}
            keyExtractor={(item) => item.label}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: 20,
              marginTop: 40,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    flexDirection: "column",
                    padding: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: item.color,
                        width: 15,
                        height: 15,
                        borderRadius: 999,
                      }}
                    />
                    <Text style={{ fontSize: 18 }}>{item.label}</Text>
                  </View>
                </View>
              );
            }}
          />
        </>
      )}
    </Layout>
  );
}
