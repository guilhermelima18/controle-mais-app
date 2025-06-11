import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    marginTop: -100,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  boxValue: {
    flexDirection: "column",
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 16,
  },
  radio: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  radioSelected: {
    backgroundColor: "#e0e7ff",
    borderColor: "#3b82f6",
  },
  radioText: {
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
