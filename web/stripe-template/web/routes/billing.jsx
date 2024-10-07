import { useQuery, useFindMany } from "@gadgetinc/react";
import { useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";

export default () => {
  const [toggled, setToggled] = useState(false);

  const [{ data: metaData, fetching: fetchingGadgetMeta }] = useQuery({
    query: `
      query {
        gadgetMeta {
          slug
          editURL
        }
      }
    `,
  });

  // fetch available products (Sass subscriptions) from Stripe
  const [{ data: products, fetching }] = useFindMany(api.stripe.product, {
    select: {
      name: true,
      prices: {
        edges: {
          node: {
            unitAmount: true,
            lookupKey: true,
            recurring: true,
            stripeId: true,
          },
        },
      },
    },
  });

  if (fetching || fetchingGadgetMeta) {
    return <div>Loading...</div>;
  }

  if (!products.length && !fetching) {
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

  return (
    <>
      <div className="plan-section">
        <div id="billing-header">
          <h2>Plans</h2>
          <div id="toggle-div">
            <span>{toggled ? "Yearly" : "Monthly"}</span>
            <div className="toggle-container">
              <input
                type="checkbox"
                id="toggle"
                className="toggle-input"
                onClick={() => setToggled(!toggled)}
              />
              <label htmlFor="toggle" className="toggle-label">
                <span className="toggle-switch"></span>
              </label>
            </div>
          </div>
        </div>

        <section className="section-stripe-products">
          {products?.map((product, i) => (
            <ProductCard
              key={`product_${i}`}
              {...{ product, interval: toggled ? "year" : "month" }}
            />
          ))}
        </section>
      </div>
    </>
  );
};
