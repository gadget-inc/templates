import { data } from "react-router";

export async function loader() {
  return data(null, 404);
}

export default function () {
  return (
    <s-page inlineSize="base">
      <s-section>
        <s-box>
          <s-stack alignItems="center" gap="small">
            <s-heading>404</s-heading>
            <s-text>Page Not Found</s-text>
            <s-link href="/">Return to Home</s-link>
          </s-stack>
        </s-box>
      </s-section>
    </s-page>
  );
}
