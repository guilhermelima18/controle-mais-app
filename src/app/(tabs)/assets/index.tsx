import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus } from "lucide-react-native";

import { useAssets } from "@/hooks/use-assets";

import { Header } from "@/components/header";
import { Layout } from "@/components/layout";
import { CardEmpty } from "@/components/cards/card-empty";

import { months } from "@/constants/months";

import { formatCurrency } from "@/helpers/masks";
import { theme } from "@/styles/theme";

export default function Assets() {
  const [periodSelected, setPeriodSelected] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const currentYear = new Date().getFullYear();

  const { assets, assetsLoading, getUserAssetsByMonth } = useAssets();

  const onRefresh = async () => {
    setRefreshing(true);

    await getUserAssetsByMonth({
      selectedMonth: periodSelected,
      year: currentYear,
    });

    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      getUserAssetsByMonth({
        selectedMonth: periodSelected,
        year: currentYear,
      });
    }, [periodSelected])
  );

  return (
    <Layout>
      {assetsLoading ? (
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
          <Header title="Ativos" />

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
              {assets?.length === 0 ? (
                <View style={{ flex: 1 }}>
                  <CardEmpty text="Nenhum ativo encontrado para este mês." />
                </View>
              ) : (
                <FlatList
                  data={assets}
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
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "500",
                                color: theme.colors.gray[900],
                              }}
                            >
                              {item.asset_type}
                            </Text>

                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "500",
                                color: theme.colors.gray[900],
                              }}
                            >
                              {formattedDate}
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "500",
                                color: theme.colors.gray[900],
                              }}
                            >
                              Ativo: {item.asset.toUpperCase()}
                            </Text>
                          </View>

                          <View>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "500",
                                color: theme.colors.gray[900],
                              }}
                            >
                              Quantidade: {item.quantity}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: "600",
                                color: theme.colors.gray[900],
                                fontSize: 18,
                              }}
                            >
                              Valor cota:{" "}
                              {formatCurrency(
                                Math.round(item.price * 100).toString()
                              )}
                            </Text>

                            <Text
                              style={{
                                fontWeight: "600",
                                color: theme.colors.green[500],
                                fontSize: 18,
                              }}
                            >
                              Valor total:{" "}
                              {formatCurrency(
                                Math.round(
                                  item.price * 100 * Number(item.quantity)
                                ).toString()
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          </View>

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
            onPress={() => router.push("/assets/new-asset")}
          >
            <Plus size={28} color={theme.colors.white[500]} />
          </TouchableOpacity>
        </>
      )}
    </Layout>
  );
}
