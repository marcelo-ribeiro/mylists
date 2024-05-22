export const formatCurrency = (value: number): string => {
  if (!value) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatCurrencyToNumber = (value: string): number => {
  if (!value) return 0;
  let formattedNumber = value.replace(".", "");
  formattedNumber = formattedNumber.replace(",", ".");
  return Number(formattedNumber);
};

export const formatNumber = (value: number): string => {
  if (!value) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "decimal",
    // useGrouping: true,
    minimumFractionDigits: 2,
  }).format(value);
};
