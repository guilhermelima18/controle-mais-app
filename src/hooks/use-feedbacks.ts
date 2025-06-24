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

type CreateFeedbackWeebHookBody = {
  title: string;
  description: string;
  type: string;
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
    } catch (error) {
      console.error("Erro ao criar o feedback: ", error);
    }
  }, []);

  const createFeedbackWebHook = useCallback(
    async (data: CreateFeedbackWeebHookBody) => {
      try {
        setCreateFeedbackWebHookLoading(true);

        const response = await axios.post(
          "https://n8n.idealab.site/webhook/controle-plus/feedback",
          { ...data },
          {
            headers: {
              "Content-Type": "application/json",
              "api-key": 'H)av"5oD<M)z)OZ,nT5/;z{o;c#G14V}rO6f{P4>Q1XS1I7^',
            },
          }
        );

        Alert.alert("Sucesso", "Feedback criado!");

        return {
          data: response.data,
          status: response.status,
        };
      } catch (error) {
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
