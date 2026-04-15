import { data } from "react-router";

export async function loader() {
  return data(null, 404);
}

export default function () {
  return (
    <div style={{ padding: "16px", backgroundColor: "#F1F1F1", height: "100vh", width: "100vw" }}>
      <s-page>
        <s-section>
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
          >
            <s-heading>404</s-heading>
            <s-text>Page not found</s-text>
            <s-link href="/">Return home</s-link>
          </div>
        </s-section>
      </s-page>
    </div>
  );
}
