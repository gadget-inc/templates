import { BlockStack, Card, Layout, Page, Text, Button } from "@shopify/polaris";
import { useQuery } from "@gadgetinc/react";
import { StyledSpinner } from "../components";
import { useEffect, useContext } from "react";
import { ShopContext } from "../providers";

/**
 * This is where your main app logic should go
 * Note that this is just a skeleton of what an app might look like
 *
 * To view the billing page, make use of your app's API Playgound. Use the following GraphQL mutation:
 */
export default () => {
  const { shop } = useContext(ShopContext);

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

  if (fetchingGadgetMetadata) {
    return (
      <Page>
        <StyledSpinner />
      </Page>
    );
  }

  return (
    <Page title="Next Steps">
      <Layout sectioned>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Create a plan record
                </Text>
                <Text as="p" variant="bodyMd">
                  To complete the subscription process, you must first create a
                  plan record. You can do this by navigating to your{" "}
                  <strong>plan</strong> model's <strong>create</strong> action
                  and clicking on run action on the right of the page.
                </Text>
                <Text as="p" variant="bodyMd">
                  Make sure to fill out all of the fields appropriately (making
                  sure to have a non-zero plan) and setting the{" "}
                  <strong>current</strong> field to <strong>true</strong>.
                </Text>
              </BlockStack>
            </Card>
            <Card sectioned>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Manually end the trial
                </Text>
                <Text as="p" variant="bodyMd">
                  To view the billing page you must run a mutation in your
                  Gadget app's API Playground. This mutation will set the{" "}
                  <strong>usedTrialMinutes</strong> field equal to 7 days (in
                  minutes) and make sure the the{" "}
                  <strong>oneTimeChargeId</strong> is set to{" "}
                  <strong>null</strong>.
                </Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    open(
                      `${gadgetMetadata.gadgetMeta.productionRenderURL}api/playground/javascript?code=${encodeURIComponent(`await api.internal.shopifyShop.update("${shop?.id}", {
  // Make sure to change this 1440 * number of days on the trial
  oneTimeChargeId: null,
  usedTrialMinutes: 10080
})`)}&enviroment=${gadgetMetadata?.gadgetMeta?.environmentName?.toLowerCase()}`,
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
