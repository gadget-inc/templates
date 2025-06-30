import { Layout, Page, PageProps } from "@shopify/polaris";
import { ReactNode } from "react";

type PageLayoutProps = {
  children: ReactNode;
} & PageProps;

export default (props: PageLayoutProps) => {
  const { children, ...rest } = props;

  return (
    <Page {...rest}>
      <Layout>{children}</Layout>
    </Page>
  );
};
