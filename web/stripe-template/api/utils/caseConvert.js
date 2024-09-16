const snakeToCamel = str =>
  str.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );

const handleStripeKeys = (key, value) => {
  let stripeKey = key, stripeValue = value;

  if (key === "id") {
    stripeKey = "stripeId"
  } else if (key === "created") {
    stripeKey = "stripeCreated"
    stripeValue = new Date(value * 1000)
  } else if (key === "updated") {
    stripeKey = "stripeUpdated"
    stripeValue = new Date(value * 1000)
  } else if (key === "currentPeriodEnd" || key === "currentPeriodStart") {
    stripeValue = new Date(value * 1000)
  }

  return [stripeKey, stripeValue];
}

export const objKeyConvert = obj => Object.entries(obj).reduce((final, [key, value]) => {
  let camelKey = snakeToCamel(key);
  let [k, v] = handleStripeKeys(camelKey, value);

  final[k] = v;

  return final;
}, {});

// remove additional fields from subscription webhook payloads
export const subscriptionDestructure = subscription => (({ stripeId, cancelAtPeriodEnd, currency, currentPeriodEnd, currentPeriodStart, customer, defaultPaymentMethod, description, latestInvoice, metadata, pendingSetupIntent, pendingUpdate, status }) => ({ stripeId, cancelAtPeriodEnd, currency, currentPeriodEnd, currentPeriodStart, customer, defaultPaymentMethod, description, latestInvoice, metadata, pendingSetupIntent, pendingUpdate, status }))(subscription);