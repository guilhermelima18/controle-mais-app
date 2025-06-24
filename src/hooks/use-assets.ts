import { useCallback, useState } from "react";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { useStorage } from "./use-storage";

import { monthsMap } from "@/constants/months";
import { getMonthRange } from "@/helpers/functions";

export type AssetsProps = {
  id: string;
  userId: string;
  type: string;
  asset: string;
  asset_type: string;
  price: number;
  quantity: string;
  date: {
    nanoseconds: number;
    seconds: number;
  };
};

export type CreateAssetBody = {
  userId: string;
  type: string;
  asset_type: string;
  asset: string;
  price: number;
  quantity: string;
  date: any;
  createdAt: any;
};

export function useAssets() {
  const [assets, setAssets] = useState<AssetsProps[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(false);

  const { getUserStorage } = useStorage();

  const getUserAssetsByMonth = useCallback(
    async ({
      selectedMonth,
      year,
    }: {
      selectedMonth: string;
      year: number;
    }) => {
      try {
        setAssetsLoading(true);

        const monthNumber = monthsMap[selectedMonth];
        const { start, end } = getMonthRange(year, monthNumber);

        let userLoggedId;
        const userLoggedStorage = await getUserStorage();

        if (userLoggedStorage && userLoggedStorage.id) {
          userLoggedId = userLoggedStorage.id;
        }

        const transactions = await firestore()
          .collection("users")
          .doc(userLoggedId)
          .collection("assets")
          .where("date", ">=", start)
          .where("date", "<", end)
          .get();

        const transactionsMapped = transactions.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setAssets(transactionsMapped as AssetsProps[]);
      } catch (error) {
        console.log("Não foi possível buscar os ativos do usuário: ", error);
      } finally {
        setAssetsLoading(false);
      }
    },
    []
  );

  const createAsset = useCallback(async (data: CreateAssetBody) => {
    try {
      await firestore()
        .collection("users")
        .doc(data.userId)
        .collection("assets")
        .add(data);

      Alert.alert("Sucesso", "Ativo criado!");
    } catch (error) {
      console.error("Erro ao criar o ativo:", error);
    }
  }, []);

  return {
    assets,
    assetsLoading,
    getUserAssetsByMonth,
    createAsset,
  };
}
