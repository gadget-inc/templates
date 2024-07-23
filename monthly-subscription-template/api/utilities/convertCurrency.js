import { default as CurrencyConvertor } from "currency-converter-lt2";

const currencyConverter = new CurrencyConvertor();

export default async function (from, to, amount) {
  return await currencyConverter.from(from).to(to).amount(amount).convert();
}
