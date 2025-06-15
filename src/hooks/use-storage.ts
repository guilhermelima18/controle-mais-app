import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserStorageProps = {
  id: string | null;
  name: string | null;
  email: string | null;
  photo: string | null;
  providerId: string | null;
};

export function useStorage() {
  const getUserStorage =
    useCallback(async (): Promise<UserStorageProps | null> => {
      try {
        const userStorage = await AsyncStorage.getItem("@controlemais:user");

        if (userStorage) {
          return JSON.parse(userStorage);
        }

        return null;
      } catch (error) {
        console.log(
          "Não foi possível buscar o usuário no LocalStorage: ",
          error
        );

        return null;
      }
    }, []);

  const createUserStorage = useCallback(
    async ({ ...data }: UserStorageProps) => {
      try {
        await AsyncStorage.setItem(
          "@controlemais:user",
          JSON.stringify({ ...data })
        );
      } catch (error) {
        console.log(
          "Não foi possível salvar o usuário no LocalStorage: ",
          error
        );
      }
    },
    []
  );

  return {
    getUserStorage,
    createUserStorage,
  };
}
