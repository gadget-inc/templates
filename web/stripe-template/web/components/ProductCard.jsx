import { useGlobalAction } from "@gadgetinc/react";
import { useCallback, useContext } from "react";
import { api } from "../api";
import { UserContext } from "../providers";

const ProductCard = ({ product: { prices, name }, interval }) => {
  const { user } = useContext(UserContext);

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
    <div className="pricing-card-container">
      {prices.edges.map((price, i) => {
        if (price.node.recurring.interval === interval) {
          return (
            <div key={i}>
              <div className="pricing-card">
                <div className="card-header">
                  <h2 className="plan-title">{name}</h2>
                  <p className="plan-price">
                    ${price.node.unitAmount / 100} /{" "}
                    {price.node.recurring.interval}
                  </p>
                </div>
                <div className="card-body">
                  <ul className="features-list">
                    <li>Feature 1</li>
                    <li>Feature 2</li>
                    <li>Feature 3</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <form onSubmit={submit}>
                    <input
                      type="hidden"
                      name="lookup_key"
                      value={price.node.lookupKey}
                    />
                    <button
                      className="btn-stripe-subscribe"
                      type="submit"
                      // disabled={user?.priceId == price.node.stripeId}
                    >
                      {/* {user?.priceId == price.node.stripeId
                        ? "Current"
                        : "Select"} */}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default ProductCard;
