import { StyleSheet } from "react-native";

import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 70,
  },
  summaryContainer: {
    width: "100%",
    flexDirection: "column",
    padding: 8,
    marginTop: -170,
    gap: 20,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    gap: 14,
  },
  halfWidth: {
    width: "48%",
  },
  categoryHeader: {
    marginTop: 20,
    padding: 4,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 12,
  },
  itemContainer: {
    backgroundColor: "#E6F0FA",
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
  fab: {
    backgroundColor: theme.colors.blue[700],
    width: 60,
    height: 60,
    borderRadius: 999999,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 40,
    right: 10,
    zIndex: 9999,
  },
});
