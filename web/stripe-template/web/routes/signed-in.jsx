import { useState, useEffect } from "react";
import { api } from "../api";
import { useQuery, useFindMany, useAction, useUser } from "@gadgetinc/react";
import ProductDisplay from "../components/ProductDisplay";
import SuccessDisplay from "../components/SuccessDisplay";
import Message from "../components/Message";

const gadgetMetaQuery = `
  query {
    gadgetMeta {
      slug
      editURL
    }
  }
`;

export default function () {
  let [message, setMessage] = useState("");
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState("");

  // fetch user data
  const user = useUser(api);

  const [{ data: metaData, fetching: fetchingGadgetMeta }] = useQuery({
    query: gadgetMetaQuery,
  });

  // fetch available products (Sass subscriptions) from Stripe
  const [{ data: products, fetching, error }] = useFindMany(
    api.stripe.product,
    {
      select: {
        name: true,
        prices: {
          edges: {
            node: {
              unitAmount: true,
              lookupKey: true,
              recurring: true,
            },
          },
        },
      },
    }
  );

  // save a new Stripe customer id to the user record after successful payment
  // customer data and error are unused in this template
  const [{ data: customer, error: customerUpdateError }, saveStripeCustomer] =
    useAction(api.user.linkToStripeCustomer);

  // frontend code is largely taken from Stripe's billing quickstart: https://stripe.com/docs/billing/quickstart
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setSuccess(true);
      const stripeSessionId = query.get("session_id");
      setSessionId(stripeSessionId);
      // use the sessionId to get the customer id from Stripe and store on the user model
      if (!user.stripeCustomerId) {
        void saveStripeCustomer({ id: user.id, stripeSessionId });
      }
    }

    if (query.get("canceled")) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);

  // right now, any user that has a customerId will be redirected to the management page
  // this means that the products will not be presented to "active" users for plan upgrades!
  if (!user.stripeCustomerId && !success && message === "" && products) {
    if (products.length === 0 && !fetchingGadgetMeta) {
      // Change this to point to the docs
      return (
        <div>
          No products found - see{" "}
          <a
            href={`${metaData.gadgetMeta.editURL}/files/README_DEV.md`}
            target="_blank"
          >
            README_DEV.md
          </a>{" "}
          for more info.
        </div>
      );
    }
    // if this is a new user without a stripeCustomerId
    return (
      <section className="section-stripe-products">
        {products.map((product, i) => (
          <ProductDisplay key={`product_${i}`} product={product} />
        ))}
      </section>
    );
  } else if (user.stripeCustomerId || (success && sessionId !== "")) {
    // if this user does have a stripeCustomerId, go to a success page where they can manage their subscription
    return <SuccessDisplay />;
  } else if (fetching) {
    // use "fetching" boolean from the useFindMany hook to display a loading message
    return <div>Loading ...</div>;
  } else {
    // just display a message for cancelled transactions
    return <Message message={message} />;
  }
}
