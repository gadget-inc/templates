import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useAction, useGlobalAction } from "@gadgetinc/react";
import Logo from "../components/Logo";
import { useContext } from "react";
import { UserContext } from "../providers";
import { useNavigate } from "react-router-dom";

export default function () {
  const [sessionId, setSessionId] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // save a new Stripe customer id to the user record after successful payment
  // customer data and error are unused in this template
  const [, saveStripeCustomer] = useAction(api.user.linkToStripeCustomer);

  const [{ data: stripePortalUrl, error }, createPortalSession] =
    useGlobalAction(api.createPortalSession);

  const submit = useCallback(async (e) => {
    e.preventDefault();
    // call the createPortalSession global action
    void createPortalSession();
  }, []);

  // frontend code is largely taken from Stripe's billing quickstart: https://stripe.com/docs/billing/quickstart
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      const stripeSessionId = query.get("session_id");
      setSessionId(stripeSessionId);
      // use the sessionId to get the customer id from Stripe and store on the user model
      if (!user.stripeCustomerId) {
        void saveStripeCustomer({ id: user.id, stripeSessionId });
      }
    }

    // Gonna need to add a handler for bad payments
    if (query.get("canceled")) {
      console.log("Payment canceled");
    }
  }, [sessionId]);

  useEffect(() => {
    console.log("user", user);

    if (!user.stripeCustomerId) navigate("/billing");
  }, []);

  if (stripePortalUrl) {
    // redirect to open the portal session
    window.location.href = stripePortalUrl;
  }

  return (
    <section
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className="div-stripe-product">
        <div className="div-product-header">
          <Logo />
          <h3 className="h-stripe-payment">Customer detected!</h3>
        </div>
        <form onSubmit={submit}>
          <button className="btn-stripe-subscribe" type="submit">
            Manage your billing information
          </button>
        </form>
      </div>
      {error && (
        <code>
          <p>Error detected!</p>
          <p>Did you save your customer portal settings in test mode?</p>
          <a
            href="https://dashboard.stripe.com/test/settings/billing/portal"
            target="_blank"
          >
            https://dashboard.stripe.com/test/settings/billing/portal
          </a>
        </code>
      )}
    </section>
  );
}
