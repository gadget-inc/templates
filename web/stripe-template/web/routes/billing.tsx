import { useGlobalAction } from "@gadgetinc/react";
import { useContext, useEffect, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";
import { UserContext } from "../providers";

export type Product = {
  name: string;
  id: string;
  prices: {
    id: string;
    unitAmount: number;
    interval: string;
    lookupKey: string;
    current: boolean;
  }[];
};

export default () => {
  const { user } = useContext(UserContext);
  const [toggled, setToggled] = useState(false),
    [loading, setLoading] = useState(true);

  const [
    {
      data: sampleProductsAdded,
      fetching: creatingSampleProducts,
      error: errorCreatingSampleProducts,
    },
    createSampleProducts,
  ] = useGlobalAction(api.addSampleProducts);

  const [{ data: products, fetching, error }, getProducts] = useGlobalAction(
    api.getProducts
  );

  useEffect(() => {
    void getProducts({ userId: user?.id });

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!fetching && error) console.error(error);
  }, [fetching, error]);

  useEffect(() => {
    if (!creatingSampleProducts && sampleProductsAdded) {
      void getProducts({ userId: user?.id });
    }
  }, [sampleProductsAdded, creatingSampleProducts]);

  useEffect(() => {
    if (!creatingSampleProducts && errorCreatingSampleProducts)
      console.error(errorCreatingSampleProducts);
  }, [creatingSampleProducts, errorCreatingSampleProducts]);

  if (fetching || loading) {
    return <div>Loading...</div>;
  }

  if (!products?.length && !fetching && !loading) {
    return (
      <div>
        <p>
          No products found. If you wish to quickly create some products, click
          the button below. Otherwise, make sure to add products in your Stripe
          dashboard.
        </p>
        <button onClick={() => void createSampleProducts()}>
          Add sample products
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="plan-section">
        <div id="billing-header">
          <h2>Plans</h2>
          {/* If you don't have monthly and yearly plans, this section can be removed */}
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
          {(products as Product[])
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
