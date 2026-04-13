import { data } from "react-router";
import PageLayout from "../components/PageLayout";

export async function loader() {
  return data(null, 404);
}

export default function () {
  return (
    <PageLayout inlineSize="base">
      <s-box>
        <s-stack alignItems="center" gap="small">
          <s-heading>404</s-heading>
          <s-text>Page Not Found</s-text>
          <s-link href="/">Return to Home</s-link>
        </s-stack>
      </s-box>
    </PageLayout>
  );
}
