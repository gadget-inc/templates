const snakeToCamel = (str) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );

const handleStripeKeys = (key, value) => {
  let stripeKey = key,
    stripeValue = value;

  if (key === "id") {
    stripeKey = "stripeId";
  } else if (key === "created") {
    stripeKey = "stripeCreatedAt";
    stripeValue = new Date(value * 1000);
  } else if (key === "updated") {
    stripeKey = "stripeUpdatedAt";
    stripeValue = new Date(value * 1000);
  } else if (key === "currentPeriodEnd" || key === "currentPeriodStart") {
    stripeValue = new Date(value * 1000);
  }

  return [stripeKey, stripeValue];
};

/**
 * Used to convert snake_case data coming from Stripe to camelCase. Date/time fields are converted, and stripe "id" fields are changed to "stripeId"
 */
export const objKeyConvert = (obj) =>
  Object.entries(obj).reduce((final, [key, value]) => {
    let camelKey = snakeToCamel(key);
    let [k, v] = handleStripeKeys(camelKey, value);

    final[k] = v;

    return final;
  }, {});

// Removes additional fields from events
export const destructure = ({ topic, obj }) => {
  switch (topic) {
    case "subscription":
      return Object.fromEntries(
        [
          "stripeId",
          "cancelAtPeriodEnd",
          "currency",
          "currentPeriodEnd",
          "currentPeriodStart",
          "customer",
          "defaultPaymentMethod",
          "description",
          "latestInvoice",
          "metadata",
          "pendingSetupIntent",
          "pendingUpdate",
          "status",
        ].map((key) => [key, obj[key]])
      );
    case "product":
      return Object.fromEntries(
        [
          "stripeId",
          "defaultPrice",
          "type",
          "livemode",
          "unitLabel",
          "taxCode",
          "metadata",
          "name",
          "active",
          "description",
          "statementDescriptor",
          "url",
          "attributes",
          "features",
          "stripeUpdatedAt",
          "packageDimensions",
          "shippable",
          "object",
          "images",
          "stripeCreatedAt",
        ].map((key) => [key, obj[key]])
      );
    case "price":
      return Object.fromEntries(
        [
          "stripeId",
          "nickname",
          "tiersMode",
          "currency",
          "metadata",
          "livemode",
          "customUnitAmount",
          "unitAmountDecimal",
          "taxBehavior",
          "recurring",
          "unitAmount",
          "transformQuantity",
          "billingScheme",
          "type",
          "active",
          "stripeCreatedAt",
          "object",
          "lookupKey",
          "product",
        ].map((key) => [key, obj[key]])
      );
    default:
      return obj;
  }
};
