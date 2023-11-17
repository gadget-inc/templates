import { useAction } from "@gadgetinc/react";
import {
  Banner,
  BlockStack,
  Layout,
  Page,
  Button,
  Card,
  Text,
  DescriptionList,
} from "@shopify/polaris";
import { api } from "./api";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { ShopContext } from "./providers";

/**
 * To view this page, run the following GraphQL mutation in your app's API Playground:
 * 
    mutation {
      internal {
        updateShopifyShop(
          id: "shopId",
          shopifyShop: {
            oneTimeChargeId: null,
            usedTrialMinutes: 10080
          }
        ) {
        success
        }
      }
    }
 * 
 */
export default () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const { shop } = useContext(ShopContext);

  const [
    { fetching: fetchingSubscription, error: errorSubscribing },
    subscribe,
  ] = useAction(api.shopifyShop.subscribe, {
    select: {
      confirmationUrl: true,
    },
  });

  /**
   * @type { () => void }
   *
   * Callback used to start the one-time purchase flow and redirect to the Shopify one-time purchase confirmation page
   */
  const handleSubscribe = useCallback(async () => {
    const res = await subscribe({ id: shop.id });

    if (res?.data?.confirmationUrl) {
      navigate(res.data.confirmationUrl);
    }
  }, [shop, subscribe]);

  /**
   * @type { () => void }
   *
   * Dismisses the error banner
   */
  const handleDismiss = useCallback(() => {
    setShow(false);
  }, []);

  // useEffect for showing an error banner when there's an issue starting the purchase flow
  useEffect(() => {
    if (!fetchingSubscription && errorSubscribing) {
      setBannerContext(errorSubscribing.message);
      setShow(true);
    } else if (fetchingSubscription) {
      setShow(false);
    }
  }, [fetchingSubscription, errorSubscribing]);

  return (
    <Page>
      <BlockStack gap="500">
        {show && (
          <Banner
            title={bannerContext}
            tone="critical"
            onDismiss={handleDismiss}
          />
        )}
        <Banner title="Your free trial has ended" tone="warning">
          <Text as="p" variant="bodyLg">
            The complimentary trial for the service has concluded, and continued
            access now requires a one-time payment. To enjoy uninterrupted
            usage, users are kindly invited to make a one-time payment to access
            the full features of the service.
          </Text>
        </Banner>
        <Layout>
          <Layout.Section>
            <BlockStack gap="600">
              <Card>
                <BlockStack gap="500">
                  <Text as="h2" variant="headingLg">
                    Features
                  </Text>
                  <DescriptionList
                    items={[
                      {
                        term: "SmartCart Upsell Engine",
                        description:
                          "Dynamically suggests complementary products or upgrades during the checkout process, maximizing average order value for merchants.",
                      },
                      {
                        term: "ReviewBoost Social Proof",
                        description:
                          "Encourages and showcases customer reviews, integrating them into product pages to build trust and boost conversion rates.",
                      },
                      {
                        term: "ShipSwift Shipping Optimizer",
                        description:
                          "Streamlines the shipping process by offering a range of carriers, calculating shipping costs in real-time, and providing customers with accurate delivery estimates.",
                      },
                    ]}
                  />
                </BlockStack>
              </Card>
              <Button variant="primary" size="large" onClick={handleSubscribe}>
                Buy now
              </Button>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
};
