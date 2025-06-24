import { createContext, ReactNode, useContext, useState } from "react";
import { Alert } from "react-native";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import firestore from "@react-native-firebase/firestore";

import { useStorage } from "@/hooks/use-storage";

type UserProviderProps = {
  children: ReactNode;
};

type UserContextProps = {
  signInLoading: boolean;
  handleGoogleSignIn: () => Promise<{ user: { id: string } } | undefined>;
};

export const UserContext = createContext({} as UserContextProps);

GoogleSignin.configure({
  webClientId:
    "425603041051-da4hopmokskm3lsalbp319ov4li28i23.apps.googleusercontent.com",
});

export function UserProvider({ children }: UserProviderProps) {
  const [signInLoading, setSignInLoading] = useState(false);

  const { createUserStorage } = useStorage();

  const handleGoogleSignIn = async () => {
    try {
      setSignInLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();

      let idToken;

      if (userInfo.data?.idToken) {
        const { idToken: token } = userInfo.data;
        idToken = token;
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);

      const userCredential = await signInWithCredential(
        getAuth(),
        googleCredential
      );

      if (userCredential?.user) {
        const userObj = {
          id: userCredential.user.uid,
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          photo: userCredential.user.photoURL,
          providerId: userCredential.user.providerId,
        };

        await firestore().collection("users").doc(userObj.id).set(userObj);
        await createUserStorage(userObj);

        return {
          user: {
            id: userObj.id,
          },
        };
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      Alert.alert(
        "Erro",
        error.message || "Não foi possível entrar com Google."
      );
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        signInLoading,
        handleGoogleSignIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
