import { BlockStack, Layout, Page, Text, Card, Button } from "@shopify/polaris";
import { useQuery } from "@gadgetinc/react";
import { StyledSpinner } from "../components";
import { useEffect } from "react";

/**
 * This is where your main app logic should go
 *
 * To end the trial period, make use of your app's API Playgound. The button in the UI will bring you to the playground with data prefilled.
 *
 */
export default () => {
  const [
    {
      data: gadgetMetadata,
      fetching: fetchingGadgetMetadata,
      error: errorFetchingGadgetMetadata,
    },
  ] = useQuery({
    query: `
      query { 
        gadgetMeta {
          productionRenderURL
          environmentName
        }
      }
    `,
  });

  useEffect(() => {
    if (!fetchingGadgetMetadata && errorFetchingGadgetMetadata) {
      console.error(errorFetchingGadgetMetadata);
    }
  }, [fetchingGadgetMetadata, errorFetchingGadgetMetadata]);

  useEffect(() => {
    if (gadgetMetadata) {
      console.log(
        `${gadgetMetadata.gadgetMeta.productionRenderURL}api/playground/javascript?code=${encodeURIComponent(`await api.internal.shopifyShop.update("1", {
  // Make sure to change this 1440 * number of days on the trial
  usedTrialMinutes: 10080
})`)}&enviroment=${gadgetMetadata.gadgetMeta.environmentName.toLowerCase()}`
      );
    }
  }, [gadgetMetadata]);

  if (fetchingGadgetMetadata) {
    return (
      <Page>
        <StyledSpinner />
      </Page>
    );
  }

  return (
    <Page title="Next steps">
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Test the monthly subscription logic
                </Text>
                <Text as="p" variant="bodyMd">
                  Change between plans by navigating to the Plans page. The page
                  should populate like it did on intial app installation. Note
                  that this template only supports non-zero plan prices. Shopify
                  requires that you give them a positive non-zero price when
                  creating an appSubscription record.
                </Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Manually end the trial
                </Text>
                <Text as="p" variant="bodyMd">
                  You may wish to see what the ShopPage component would look
                  like once the trial is completed. To do this run the following
                  mutation. This mutation will set the{" "}
                  <strong>usedTrialMinutes</strong> field equal to 7 days (in
                  minutes). Make sure to adjust the number if you have more
                  trial days.
                </Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    open(
                      `${gadgetMetadata.gadgetMeta.productionRenderURL}api/playground/javascript?code=${encodeURIComponent(`await api.internal.shopifyShop.update("1", {
  // Make sure to change this 1440 * number of days on the trial
  usedTrialMinutes: 10080
})`)}&enviroment=${gadgetMetadata.gadgetMeta.environmentName.toLowerCase()}`,
                      "_blank"
                    )
                  }
                >
                  Open API Playground
                </Button>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
