import { PlanCurrencyToShopCurrencyGlobalActionContext } from "gadget-server";
import CurrencyConverter from "currency-converter-lt";

/**
 * @param { PlanCurrencyToShopCurrencyGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const response = {};

  // Fetch the current shop's currency field
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

    // Fetches all plans (does not account for private plans - missing feature)
    const plans = await api.plan.findMany({
      select: {
        id: true,
        pricePerOrder: true,
        currency: true,
      },
      first: 250,
    });

    // Loop through all plans and construct the response object
    for (const plan of plans) {
      if (plan.pricePerOrder) {
        response[plan.id] = await currencyConverter
          .from(plan.currency)
          .to(shop.currency)
          .convert(plan.pricePerOrder);
      } else {
        response[plan.id] = 0;
      }
    }
  }

  return response;
}
