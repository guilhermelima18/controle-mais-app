export function onlyLetters(v: any) {
  return v?.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]/g, "");
}

export function onlyNumbers(v: any) {
  return v?.replace(/[^0-9]/g, "");
}

export function formatCurrency(value: string) {
  const numeric = Number(value.replace(/\D/g, ""));
  const number = isNaN(numeric) ? 0 : numeric / 100;

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
