import { useQuery, useGlobalAction } from "@gadgetinc/react";
import { useContext, useEffect, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";
import { UserContext } from "../providers";

export default () => {
  const { user } = useContext(UserContext);
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

  const [{ data: products, fetching, error }, getProducts] = useGlobalAction(
    api.getProducts
  );

  useEffect(() => {
    void getProducts({ userId: user.id });
  }, []);

  useEffect(() => {
    if (!fetching && error) console.error(error);
  }, [fetching, error]);

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
          {products
            ?.sort((a, b) => a.prices[0].unitAmount - b.prices[0].unitAmount)
            .map((product, i) => (
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
