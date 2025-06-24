import { useCallback, useState } from "react";
import { Alert } from "react-native";
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
  hasCompleted: boolean;
};

export type CreateTransactionBody = {
  userId: string;
  type: string;
  value: number;
  category: string;
  description: string;
  hasCompleted: boolean;
  date: any;
  createdAt: any;
};

export type UpdateTransactionBody = {
  type?: string;
  value?: number;
  category?: string;
  description?: string;
  hasCompleted?: boolean;
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
        .collection("users")
        .doc(userLoggedId)
        .collection("transactions")
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
          .collection("users")
          .doc(userLoggedId)
          .collection("transactions")
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

  const createTransaction = useCallback(async (data: CreateTransactionBody) => {
    try {
      await firestore()
        .collection("users")
        .doc(data.userId)
        .collection("transactions")
        .add(data);

      Alert.alert("Sucesso", "Transação criada!");
    } catch (error) {
      console.error("Erro ao criar a transação:", error);
    }
  }, []);

  const updateTransaction = useCallback(
    async ({
      transactionId,
      userId,
      data,
    }: {
      transactionId: string;
      userId: string;
      data: UpdateTransactionBody;
    }) => {
      try {
        await firestore()
          .collection("users")
          .doc(userId)
          .collection("transactions")
          .doc(transactionId)
          .update(data);

        Alert.alert("Sucesso", "Transação atualizada!");
      } catch (error) {
        console.error("Erro ao atualizar a transação:", error);
      }
    },
    []
  );

  const deleteTransaction = useCallback(
    async ({
      transactionId,
      userId,
    }: {
      transactionId: string;
      userId: string;
    }) => {
      try {
        await firestore()
          .collection("users")
          .doc(userId)
          .collection("transactions")
          .doc(transactionId)
          .delete();

        Alert.alert("Sucesso", "Transação excluída!");
      } catch (error) {
        console.error("Erro ao excluir a transação:", error);
      }
    },
    []
  );

  return {
    transactions,
    transactionsLoading,
    getUserTransactions,
    getUserTransactionsByMonth,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
