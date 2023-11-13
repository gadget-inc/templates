import { PlanCurrencyToShopCurrencyGlobalActionContext } from "gadget-server";
import CurrencyConverter from "currency-converter-lt";

const currencyConverter = new CurrencyConverter();

/**
 * @param { PlanCurrencyToShopCurrencyGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const response = {};

  const shop = await api.shopifyShop.maybeFindOne(
    connections.shopify.currentShopId,
    {
      select: {
        currency: true,
      },
    }
  );

  return await currencyConverter
    .from("CAD")
    .to(shop.currency)
    .convert(10);
}
