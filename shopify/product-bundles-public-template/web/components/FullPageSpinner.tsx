export function FullPageSpinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <s-spinner accessibility-label="Loading" size="large" />
    </div>
  );
}
