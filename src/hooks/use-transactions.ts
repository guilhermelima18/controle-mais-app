import { useCallback, useState } from "react";
import firestore from "@react-native-firebase/firestore";

import { useStorage } from "./use-storage";

import { monthsMap } from "@/constants/months";
import { getMonthRange } from "@/helpers/functions";

export type TransactionsProps = {
  id: string;
  userId: string;
  type: string;
  value: number;
  category: string;
  date: {
    nanoseconds: number;
    seconds: number;
  };
  description: string;
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionsProps[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const { getUserStorage } = useStorage();

  const getUserTransactions = useCallback(async () => {
    try {
      setTransactionsLoading(true);

      let userLoggedId;
      const userLoggedStorage = await getUserStorage();

      if (userLoggedStorage && userLoggedStorage.id) {
        userLoggedId = userLoggedStorage.id;
      }

      const transactions = await firestore()
        .collection("transactions")
        .where("userId", "==", userLoggedId)
        .get();

      const transactionsMapped = transactions.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setTransactions(transactionsMapped as TransactionsProps[]);
    } catch (error) {
      console.log("Não foi possível buscar as transações do usuário: ", error);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  const getUserTransactionsByMonth = useCallback(
    async ({
      selectedMonth,
      year,
    }: {
      selectedMonth: string;
      year: number;
    }) => {
      try {
        setTransactionsLoading(true);

        const monthNumber = monthsMap[selectedMonth];
        const { start, end } = getMonthRange(year, monthNumber);

        let userLoggedId;
        const userLoggedStorage = await getUserStorage();

        if (userLoggedStorage && userLoggedStorage.id) {
          userLoggedId = userLoggedStorage.id;
        }

        const transactions = await firestore()
          .collection("transactions")
          .where("userId", "==", userLoggedId)
          .where("date", ">=", start)
          .where("date", "<", end)
          .get();

        const transactionsMapped = transactions.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setTransactions(transactionsMapped as TransactionsProps[]);
      } catch (error) {
        console.log(
          "Não foi possível buscar as transações do usuário: ",
          error
        );
      } finally {
        setTransactionsLoading(false);
      }
    },
    []
  );

  return {
    transactions,
    transactionsLoading,
    getUserTransactions,
    getUserTransactionsByMonth,
  };
}
