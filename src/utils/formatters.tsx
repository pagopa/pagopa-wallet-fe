/* eslint-disable no-param-reassign */
export function expireDateFormatter(old: string, current: string) {
  if (current.charAt(1) === "/") {
    current = "0" + current;
  }
  if (current.length === 1 && Number(current) > 1) {
    return "0" + current;
  }
  if (current.length === 3 && !current.includes("/")) {
    return old + "/" + current.slice(-1);
  }
  if (current.length >= 6 && current.includes("/")) {
    return current.split("/")[0] + "/" + current.split("/")[1].slice(2);
  }
  return current;
}

export function cleanSpaces(text: string) {
  return text.replace(/\s/g, "");
}
/**
 * This function format number to EUR currency by it-IT locale
 * by default amount is in CENTS
 */
export function moneyFormat(
  amount: number,
  decimalDigits: number = 2,
  fractionDigits: number = 2
) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount ? amount / Math.pow(10, decimalDigits) : 0);
}
