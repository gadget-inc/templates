import { BlockStack, Card, Text } from "@shopify/polaris";
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";
import { useEffect } from "react";
import { PageTemplate, Spinner } from "../components";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();

  const [
    { data: bundles, fetching: fetchingBundles, error: errorFetchingBundles },
  ] = useFindMany(api.bundle, {
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
    },
  });

  useEffect(() => {
    if (!fetchingBundles && errorFetchingBundles) {
      console.error(errorFetchingBundles);
    }
  }, [fetchingBundles, errorFetchingBundles]);

  useEffect(() => {
    if (!fetchingBundles && !bundles.length) {
      navigate("/create-bundle");
    }
  }, [bundles, fetchingBundles]);

  if (fetchingBundles) {
    return <Spinner />;
  }

  return (
    <PageTemplate>
      <BlockStack gap="500" align="start" inlineAlign="center">
        {bundles?.map((bundle, key) => (
          <Card key={key}>
            <Text>Hello World</Text>
          </Card>
        ))}
      </BlockStack>
    </PageTemplate>
  );
};
