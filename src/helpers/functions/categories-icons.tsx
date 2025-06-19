import {
  Book,
  HeartPulse,
  LucideIcon,
  ShoppingCart,
  Smile,
  Truck,
  Home as HomeIcon,
  Shirt,
  Briefcase,
  LineChart,
  CircleHelp,
} from "lucide-react-native";

export const categoryIcons: Record<string, LucideIcon> = {
  alimentacao: ShoppingCart,
  transportes: Truck,
  lazer: Smile,
  saude: HeartPulse,
  educacao: Book,
  moradia: HomeIcon,
  compras: Shirt,
  trabalho: Briefcase,
  investimentos: LineChart,
  outros: CircleHelp,
};
