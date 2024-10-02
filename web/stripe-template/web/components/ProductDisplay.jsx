import { useGlobalAction } from "@gadgetinc/react";
import { useCallback } from "react";
import Logo from "./Logo";
import { api } from "../api";

const ProductDisplay = ({ product: { prices, name }, interval }) => {
  const [{ data: stripeCheckoutUrl, error }, stripeSubscribe] = useGlobalAction(
    api.createCheckoutSession
  );

  const submit = useCallback(async (e) => {
    e.preventDefault();
    // call the createCheckoutSession global action
    void stripeSubscribe({ lookupKey: e.target[0].value });
  }, []);

  // redirect to Stripe's checkout page
  if (stripeCheckoutUrl) {
    window.location.href = stripeCheckoutUrl;
  }

  return (
    <div className="div-stripe-product">
      {prices.edges.map((price, i) => {
        if (price.node.recurring.interval === interval) {
          return (
            <>
              <h3 className="h-stripe-payment">{name}</h3>
              <span className="h-stripe-payment">
                ${price.node.unitAmount / 100} / {price.node.recurring.interval}
              </span>
              <div className="div-stripe-price" key={`price_card_${i}`}>
                <div className="div-product-body">
                  <p className="p-stripe-message">List features here!</p>
                  <form onSubmit={submit}>
                    {/* Add a hidden field with the lookup_key of your Price */}
                    <input
                      type="hidden"
                      name="lookup_key"
                      value={price.node.lookupKey}
                    />
                    <button className="btn-stripe-subscribe" type="submit">
                      Select
                    </button>
                  </form>
                </div>
              </div>
            </>
          );
        }
      })}
    </div>
  );
};

export default ProductDisplay;
