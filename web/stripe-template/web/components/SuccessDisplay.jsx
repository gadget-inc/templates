import { useGlobalAction } from "@gadgetinc/react";
import { useCallback } from "react";
import Logo from "./Logo";
import { api } from "../api";

const SuccessDisplay = () => {
  const [{ data: stripePortalUrl, error }, createPortalSession] = useGlobalAction(api.createPortalSession);

  const submit = useCallback(async (e) => {
    e.preventDefault();
    // call the createPortalSession global action
    void createPortalSession();
  }, []);

  if (stripePortalUrl) {
    // redirect to open the portal session
    window.location.href = stripePortalUrl;
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
      {error &&
        <code>
          <p>Error detected!</p>
          <p>Did you save your customer portal settings in test mode?</p>
          <a href="https://dashboard.stripe.com/test/settings/billing/portal" target="_blank">https://dashboard.stripe.com/test/settings/billing/portal</a>
        </code>
      }
    </section>
  );
};

export default SuccessDisplay;