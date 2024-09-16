import { useGlobalAction } from "@gadgetinc/react";
import { useCallback } from "react";
import Logo from "./Logo";
import { api } from "../api";

const ProductDisplay = ({ product }) => {
  const [{ data: stripeCheckoutUrl, error }, stripeSubscribe] = useGlobalAction(api.createCheckoutSession);

  const submit = useCallback(async (e) => {
    e.preventDefault();
    // call the createCheckoutSession global action
    void stripeSubscribe({ lookupKey: e.target[0].value });
  }, [])

  // redirect to Stripe's checkout page
  if (stripeCheckoutUrl) {
    window.location.href = stripeCheckoutUrl;
  }

  return (
    <div className="div-stripe-product">
      <div className="div-product-header">
        <Logo />
        <h3 className="h-stripe-payment">{product.name}</h3>
      </div>
      <p className="p-stripe-message">List features here!</p>
      <div className="div-product-body">
        {product.prices.edges.sort((p1) => p1.node.recurring.interval === "year" ? 1 : -1).map((price, i) => (
          <div className="div-stripe-price" key={`price_card_${i}`}>
            <h5 className="h-stripe-payment">${price.node.unitAmount / 100} / {price.node.recurring.interval}</h5>
            <form onSubmit={submit}>
              {/* Add a hidden field with the lookup_key of your Price */}
              <input type="hidden" name="lookup_key" value={price.node.lookupKey} />
              <button className="btn-stripe-subscribe" type="submit">
                Sign-up
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
};

export default ProductDisplay;