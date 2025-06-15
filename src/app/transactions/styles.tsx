import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    margin: 6,
  },
  iconWrapper: {
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  itemTextWrapper: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemValue: {
    fontWeight: "600",
  },
});
