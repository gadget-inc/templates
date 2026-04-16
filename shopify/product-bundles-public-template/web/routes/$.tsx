import { data } from "react-router";

export async function loader() {
  return data(null, 404);
}

export default function () {
  return (
    <s-page inlineSize="base" heading="404">
      <s-section>
        <s-stack alignItems="center" gap="small">
          <s-text>Page Not Found</s-text>
          <s-link href="/">Return to Home</s-link>
        </s-stack>
      </s-section>
    </s-page>
  );
}
