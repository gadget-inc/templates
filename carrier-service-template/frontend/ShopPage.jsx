import {
  BlockStack,
  Page,
  Text,
  Card,
  Layout,
  DescriptionList,
} from "@shopify/polaris";

/**
 * This component is the main page of the carrier service app. After forking, it has information on the necessary components of the carrier service app and links to Shopify and FedEx documentation.
 *
 * @returns { import("react").ReactElement } A React functional component
 */
const ShopPage = () => {
  return (
    <Page
      title="Next Steps"
      subtitle="Make sure to provide instructions on how to use your carrier service app"
    >
      <Layout sectioned>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Environment variables
                </Text>
                <Text as="p" variant="bodyMd">
                  Make sure to add the following environment variables to your
                  Gadget app before testing the carrier service. This
                  information can be found on the FedEx developer portal once
                  you've created an account.
                </Text>
                <DescriptionList
                  items={[
                    {
                      term: "FEDEX_ACCOUNT_NUMBER",
                      description:
                        "The shipping account number obtained after making a FedEx developer account",
                    },
                    {
                      term: "FEDEX_API_KEY",
                      description:
                        "Your FedEx Developer API key obtained after making a project on the FedEx developer portal",
                    },
                    {
                      term: "FEDEX_SECRET_KEY",
                      description:
                        "Your FedEx Developer API secret key obtained after making a project on the FedEx developer portal",
                    },
                  ]}
                />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Configure your carrier service
                </Text>
                <Text as="p" variant="bodyMd">
                  In order to use your carrier service, you need to configure it
                  in the store. Please note that this carrier service template
                  makes use of the FedEx API. For information on how to set up a
                  the carrier service in a store and a FedEx account, follow the
                  information in the links below.
                </Text>
                <BlockStack gap="300">
                  <a
                    href="https://help.shopify.com/en/manual/shipping/setting-up-and-managing-your-shipping/enabling-shipping-carriers"
                    target="_blank"
                  >
                    Enabling shipping carriers
                  </a>
                  <a
                    href="https://help.shopify.com/en/manual/shipping/setting-up-and-managing-your-shipping/setting-up-shipping-rates#create-calculated-shipping-rates"
                    target="_blank"
                  >
                    Setting up shipping rates
                  </a>
                  <a
                    href="https://shopify.dev/docs/api/admin-rest/2023-07/resources/carrierservice"
                    target="_blank"
                  >
                    Carrier service API
                  </a>
                  <a
                    href="https://developer.fedex.com/api/en-us/catalog/authorization/v1/docs.html"
                    target="_blank"
                  >
                    FedEx API authorization
                  </a>
                  <a
                    href="https://developer.fedex.com/api/en-us/catalog/rate/v1/docs.html"
                    target="_blank"
                  >
                    FedEx rates and transit time API
                  </a>
                </BlockStack>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Testing
                </Text>
                <Text as="p" variant="bodyMd">
                  Make sure that you test your application's configuration
                  before extending it. The two best ways to do so are through
                  Postman and the Shopify development store's checkout flow.
                </Text>
                <DescriptionList
                  items={[
                    {
                      term: "Postman",
                      description:
                        "You can use Postman to ping your Gadget app's get-rates route with the example request that Shopify provides",
                    },
                    {
                      term: "Development store checkout flow",
                      description:
                        "You can test your application using the checkout on any dev store on which your application is installed. If you experience errors in the checkout it's possible that your shipping and delivery settings are not set up properly",
                    },
                  ]}
                />
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopPage;
