import { BlockStack, Text } from "@shopify/polaris";

export default function () {
  return (
    <BlockStack gap="300">
      <BlockStack>
        <img
          src="https://assets.gadget.dev/assets/default-app-assets/react-logo.svg"
          className="app-logo"
          alt="logo"
        />
        <Text as="span">
          You are now signed out of {process.env.GADGET_APP} &nbsp;
        </Text>
      </BlockStack>
      <BlockStack>
        <Text as="p">Start building your app&apos;s signed out area</Text>
        <a
          href="/edit/files/web/routes/index.jsx"
          target="_blank"
          rel="noreferrer"
          style={{ fontWeight: 500 }}
        >
          web/routes/index.jsx
        </a>
      </BlockStack>
    </BlockStack>
  );
}
