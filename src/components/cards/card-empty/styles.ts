import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E0", // cinza claro
    backgroundColor: "#F7FAFC", // fundo cinza bem claro
    borderRadius: 12,
    padding: 36,
    margin: 16,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  icon: {
    marginBottom: 8,
  },
  text: {
    color: "#718096", // cinza médio
    fontSize: 18,
    textAlign: "center",
    lineHeight: 28,
  },
});
