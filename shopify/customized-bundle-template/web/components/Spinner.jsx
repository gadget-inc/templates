import { Spinner } from "@shopify/polaris";

// A spinner component used to indicate that a page or component is loading
export default () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Spinner accessibilityLabel="Spinner example" size="large" />
    </div>
  );
};
