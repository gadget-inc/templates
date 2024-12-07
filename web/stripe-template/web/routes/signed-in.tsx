import { useEffect, useCallback, SyntheticEvent } from "react";
import { api } from "../api";
import { useGlobalAction } from "@gadgetinc/react";
import Logo from "../components/Logo";
import { useContext } from "react";
import { UserContext } from "../providers";
import { useNavigate } from "react-router-dom";

export default function () {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [{ data: stripePortalUrl, error }, createPortalSession] =
    useGlobalAction(api.createPortalSession);

  const submit = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();
    // call the createPortalSession global action
    void createPortalSession();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (!user?.stripeCustomerId && query.get("canceled")) navigate("/billing");
  }, []);

  if (stripePortalUrl) {
    // redirect to open the portal session
    window.location.href = stripePortalUrl;
  }

  return (
    <section id="customer-card">
      <div className="div-stripe-product">
        <div className="div-product-header">
          <Logo />
          <h3 className="h-stripe-payment">
            {user?.stripeCustomerId ? "Customer detected!" : "Choose a plan "}
          </h3>
        </div>
        {user?.stripeCustomerId && !user?.stripeSubscription && (
          <p>You currently do not have an active subscription.</p>
        )}
        {user?.stripeCustomerId && (
          <form onSubmit={submit}>
            <button className="btn-stripe-subscribe" type="submit">
              Manage your billing information
            </button>
          </form>
        )}
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
