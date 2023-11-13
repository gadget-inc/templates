import { PlanCurrencyToShopCurrencyGlobalActionContext } from "gadget-server";
import CurrencyConverter from "currency-converter-lt";

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

  if (shop) {
    const currencyConverter = new CurrencyConverter();

    const plans = await api.plan.findMany({
      select: {
        id: true,
        monthlyPrice: true,
        currency: true,
      },
    });

    for (const plan of plans) {
      if (plan.monthlyPrice) {
        response[plan.id] = await currencyConverter
          .from(plan.currency)
          .to(shop.currency)
          .convert(plan.monthlyPrice);
      } else {
        response[plan.id] = 0;
      }
    }
  }

  return response;
}
