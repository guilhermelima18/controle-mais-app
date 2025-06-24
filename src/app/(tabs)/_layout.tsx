import { Tabs } from "expo-router";
import {
  HandCoins,
  Home,
  List,
  MessageCircleCode,
  PieChart,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="transactions/index"
        options={{
          title: "Transações",
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="transactions/new-transaction/index"
        options={{
          title: "",
          href: null,
          tabBarIcon: () => null,
        }}
      />

      <Tabs.Screen
        name="assets/index"
        options={{
          title: "Ativos",
          tabBarIcon: ({ color, size }) => (
            <HandCoins color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="assets/new-asset/index"
        options={{
          title: "",
          href: null,
          tabBarIcon: () => null,
        }}
      />

      <Tabs.Screen
        name="reports/index"
        options={{
          title: "Relatórios",
          tabBarIcon: ({ color, size }) => (
            <PieChart color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="feedbacks/index"
        options={{
          title: "Feedbacks",
          tabBarIcon: ({ color, size }) => (
            <MessageCircleCode color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
