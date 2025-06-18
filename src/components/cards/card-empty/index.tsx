import { View, Text } from "react-native";
import { AlertCircle } from "lucide-react-native";

import { styles } from "./styles";

type CardEmptyMessageProps = {
  text: string;
};

export function CardEmpty({ text }: CardEmptyMessageProps) {
  return (
    <View style={styles.container}>
      <AlertCircle size={42} color="#A0AEC0" style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}
