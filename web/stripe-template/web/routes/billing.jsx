import { useGlobalAction } from "@gadgetinc/react";
import { useContext, useEffect, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";
import { UserContext } from "../providers";

export default () => {
  const { user } = useContext(UserContext);
  const [toggled, setToggled] = useState(false);

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
    void getProducts({ userId: user.id });
  }, []);

  useEffect(() => {
    if (!fetching && error) console.error(error);
  }, [fetching, error]);

  useEffect(() => {
    if (!creatingSampleProducts && sampleProductsAdded) {
      void getProducts({ userId: user.id });
    }
  }, [sampleProductsAdded, creatingSampleProducts]);

  useEffect(() => {
    if (!creatingSampleProducts && errorCreatingSampleProducts)
      console.error(errorCreatingSampleProducts);
  }, [creatingSampleProducts, errorCreatingSampleProducts]);

  if (fetching) {
    return <div>Loading...</div>;
  }

  if (!products?.length && !fetching) {
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
