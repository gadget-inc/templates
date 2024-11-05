import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <Page>
      <TitleBar title="Sample Product Quiz Admin - by Gadget" />
      {children}
    </Page>
  );
};
