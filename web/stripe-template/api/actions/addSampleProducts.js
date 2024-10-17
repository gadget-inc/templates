import { AddSampleProductsGlobalActionContext } from "gadget-server";
import { stripe } from "../stripe";

/**
 * @param { AddSampleProductsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  // amount fields are in cents, as per Stripe's Product API: https://stripe.com/docs/api/products/create
  await createProduct({
    name: "Basic",
    monthlyAmount: 1000,
    annualAmount: 10000,
  });
  await createProduct({
    name: "Pro",
    monthlyAmount: 2500,
    annualAmount: 25000,
  });

  return true;
}

async function createProduct({ name, monthlyAmount, annualAmount }) {
  const product = await stripe.products.create({
    name,
  });

  await stripe.prices.create({
    nickname: `${name} monthly`,
    product: product.id,
    unit_amount: monthlyAmount,
    recurring: {
      interval: "month",
    },
    currency: "cad",
    lookup_key: `${product.id}_monthly`,
  });

  await stripe.prices.create({
    nickname: `${name} yearly`,
    product: product.id,
    unit_amount: annualAmount,
    recurring: {
      interval: "year",
    },
    currency: "cad",
    lookup_key: `${product.id}_yearly`,
  });
}
