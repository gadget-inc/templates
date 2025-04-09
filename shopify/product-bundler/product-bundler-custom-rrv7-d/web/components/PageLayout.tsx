import {
  BlockStack,
  FooterHelp,
  Link,
  Page,
  type PageProps,
  Text,
} from "@shopify/polaris";

type LayoutProps = {
  children: React.ReactNode;
} & PageProps;

// This is a wrapper for all pages which allows for easy navigation and form submissions
export default (props: LayoutProps) => {
  const { children, ...rest } = props;

  return (
    <Page {...rest}>
      <BlockStack gap="500">
        {children}
        <FooterHelp align="center">
          <Text as="span" alignment="center">
            Powered by{" "}
            <Link
              target="_blank"
              monochrome
              removeUnderline
              url="https://gadget.dev"
            >
              <Text as="strong">Gadget</Text>
            </Link>
          </Text>
        </FooterHelp>
      </BlockStack>
    </Page>
  );
};
