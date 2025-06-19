export const categories = [
  {
    label: "Alimentação",
    value: "alimentacao",
  },
  {
    label: "Transportes",
    value: "transportes",
  },
  {
    label: "Lazer",
    value: "lazer",
  },
  {
    label: "Saúde",
    value: "saude",
  },
  {
    label: "Educação",
    value: "educacao",
  },
  {
    label: "Moradia",
    value: "moradia",
  },
  {
    label: "Compras",
    value: "compras",
  },
  {
    label: "Trabalho",
    value: "trabalho",
  },
  {
    label: "Investimentos",
    value: "investimentos",
  },
  {
    label: "Outros",
    value: "outros",
  },
];

export const categoriesMapped: Record<string, string> = {
  alimentacao: "Alimentação",
  transportes: "Transportes",
  lazer: "Lazer",
  saude: "Saúde",
  educacao: "Educação",
  moradia: "Moradia",
  compras: "Compras",
  trabalho: "Trabalho",
  investimentos: "Investimentos",
  outros: "Outros",
};

export const categoryColors: Record<string, string> = {
  alimentacao: "#FF6B6B", // vermelho
  transportes: "#29873d", // verde
  lazer: "#FFD93D", // amarelo
  saude: "#4D96FF", // azul
  educacao: "#9D4EDD", // roxo
  moradia: "#FF9F1C", // laranja
  compras: "#F15BB5", // rosa
  trabalho: "#00BBF9", // azul claro
  investimentos: "#4ba65d", // verde esmeralda
  outros: "#A0AEC0", // cinza
};
