import {
  ActionOptions,
  GetPlansAtShopCurrencyGlobalActionContext,
} from "gadget-server";
import CurrencyConverter from "currency-converter-lt";

/**
 * @param { GetPlansAtShopCurrencyGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const response = [];

  const shop = await api.shopifyShop.maybeFindOne(
    connections.shopify.currentShopId,
    {
      select: {
        currency: true,
      },
    }
  );

  if (!shop) throw new Error("No Shopify context found");

  const currencyConverter = new CurrencyConverter();

  const plans = await api.plan.findMany({
    select: {
      id: true,
      monthlyPrice: true,
      currency: true,
      name: true,
      description: true,
      trialDays: true,
    },
    sort: {
      monthlyPrice: "Ascending", // Prices from lowest to highest
    },
  });

  if (!plans?.length) throw new Error("Must have plans to run this action");

  for (const plan of plans) {
    if (plan.monthlyPrice) {
      response.push({
        id: plan.id,
        monthlyPrice: await currencyConverter
          .from(plan.currency)
          .to(shop.currency)
          .convert(plan.monthlyPrice),
        currency: shop.currency,
        name: plan.name,
        description: plan.description,
        trialDays: plan.trialDays,
      });
    } else {
      response.push({
        id: plan.id,
        monthlyPrice: 0,
        currency: shop.currency,
        name: plan.name,
        description: plan.description,
        trialDays: plan.trialDays,
      });
    }
  }

  return response;
}

/** @type { ActionOptions } */
export const options = {};
