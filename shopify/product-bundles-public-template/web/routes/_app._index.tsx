import { AutoTable } from "@gadgetinc/react/auto/polaris-wc";
import { api } from "../api";

export default function Index() {
  return (
    <s-page heading="App">
      <s-section>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <img
            src="https://assets.gadget.dev/assets/icon.svg"
            style={{ width: "72px", height: "72px" }}
          />
          <s-box>
            <s-text>Edit this page's code directly: </s-text>
            <s-link
              href={`/edit/files/web/routes/_app._index.tsx?openShopifyOnboarding=true`}
              target="_blank"
            >
              web/routes/_app._index.tsx
            </s-link>
          </s-box>
        </div>
      </s-section>
      <s-section padding="none">
        {/* use Autocomponents to build UI quickly: https://docs.gadget.dev/guides/frontend/autocomponents  */}
        <AutoTable
          //@ts-ignore
          model={api.shopifyShop}
          columns={["name", "countryName", "customerEmail"]}
        />
        <s-box padding="base" borderWidth="base none">
          <s-text>Shop records fetched from: </s-text>
          <s-link href={`/edit/model/DataModel-Shopify-Shop/data`} target="_blank">
            api/models/shopifyShop/data
          </s-link>
        </s-box>
      </s-section>
    </s-page>
  );
}
