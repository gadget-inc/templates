import { AutoForm, AutoTable } from "@gadgetinc/react/auto/polaris-wc";
import { api } from "../api";

export default function Index() {
  return (
    <s-page heading="Product tagger">
      <s-section heading="Add keywords">
        {/* This form allows users to add new keywords */}
        <AutoForm title={false} action={api.allowedTag.create} />
      </s-section>
      <s-section heading="Keywords">
        {/* This table displays the allowed keywords for the Shopify product */}
        <AutoTable model={api.allowedTag} columns={["keyword"]} />
      </s-section>
    </s-page>
  );
}