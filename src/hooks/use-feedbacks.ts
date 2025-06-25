import { useCallback, useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import firestore from "@react-native-firebase/firestore";

import { useStorage } from "./use-storage";

type CreateFeedbackBody = {
  title: string;
  description: string;
  type: string;
  link: string;
  createdAt: any;
};

export type FeedbacksType = "Error" | "Sugestion" | "Improvement";

type CreateFeedbackWeebHookBody = {
  title: string;
  description: string;
  type: FeedbacksType;
  attachment: {
    link: string;
  }[];
};

export function useFeedbacks() {
  const [createFeedbackWebHookLoading, setCreateFeedbackWebHookLoading] =
    useState(false);

  const { getUserStorage } = useStorage();

  const createFeedback = useCallback(async (data: CreateFeedbackBody) => {
    try {
      let userLoggedId;
      const userLoggedStorage = await getUserStorage();

      if (userLoggedStorage && userLoggedStorage.id) {
        userLoggedId = userLoggedStorage.id;
      }

      await firestore()
        .collection("users")
        .doc(userLoggedId)
        .collection("feedbacks")
        .add(data);
    } catch (error: any) {
      console.error("Erro ao criar o feedback: ", error);
    }
  }, []);

  const createFeedbackWebHook = useCallback(
    async (data: CreateFeedbackWeebHookBody) => {
      try {
        setCreateFeedbackWebHookLoading(true);

        const response = await axios.post(
          "https://n8n.idealab.site/webhook/controle-plus/feedback",
          { ...data, board_id: "6GyAhPoN" },
          {
            headers: {
              "api-key": "rMjkpgNsF0Ph9f0W2Gq4Lo3kJ0VJAe53YFyTq9rkm0sBlIwar8",
            },
          }
        );

        Alert.alert("Sucesso", "Feedback criado!");

        return {
          data: response.data,
          status: response.status,
        };
      } catch (error: any) {
        console.error("Erro ao disparar o webhook: ", error);
      } finally {
        setCreateFeedbackWebHookLoading(false);
      }
    },
    []
  );

  return {
    createFeedbackWebHookLoading,
    createFeedback,
    createFeedbackWebHook,
  };
}
