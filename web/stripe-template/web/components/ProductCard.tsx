import { useGlobalAction } from "@gadgetinc/react";
import { SyntheticEvent, useCallback, useContext } from "react";
import { api } from "../api";
import type { Product } from "../routes/billing";
import { UserContext } from "../providers";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product: { prices, name },
  interval,
}: {
  product: Product;
  interval: string;
}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [{ data: stripeCheckoutUrl }, stripeSubscribe] = useGlobalAction(
    api.createCheckoutSession
  );

  const [, updateSubscription] = useGlobalAction(api.updateSubscription);

  const submit = useCallback(
    async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const priceId = (form[0] as HTMLInputElement).value;

      if (
        user?.stripeSubscription?.status == "active" &&
        !user?.stripeSubscription?.cancelAtPeriodEnd &&
        user?.stripeCustomerId
      ) {
        const { data, error: subUpdateError } = await updateSubscription({
          subscriptionId: user.stripeSubscription.stripeId,
          priceId,
        });

        if (subUpdateError) console.error(subUpdateError);

        if (data?.status === "ok") navigate("/");
      } else {
        // call the createCheckoutSession global action
        void stripeSubscribe({ priceId });
      }
    },
    []
  );

  // redirect to Stripe's checkout page
  if (stripeCheckoutUrl) {
    window.location.href = stripeCheckoutUrl;
  }

  return (
    <div className="pricing-card-container">
      {prices.map((price, i) => {
        if (price.interval === interval) {
          return (
            <div key={i}>
              <div className="pricing-card">
                <div className="card-header">
                  <h2 className="plan-title">{name}</h2>
                  <p className="plan-price">
                    ${price.unitAmount / 100} / {price.interval}
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
                    {/* Add the updateSubscription global action as an option if theres a current sub */}
                    <input type="hidden" name="lookup_key" value={price.id} />
                    <button
                      className="btn-stripe-subscribe"
                      type="submit"
                      disabled={price.current}
                    >
                      {price.current ? "Current" : "Select"}
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
