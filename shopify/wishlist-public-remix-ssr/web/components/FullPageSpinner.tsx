import { Spinner } from "@shopify/polaris";

export function FullPageSpinner() {
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
}
